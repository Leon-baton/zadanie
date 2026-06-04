import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import * as packageJson from '../package.json';
import { AppModule } from './app.module';
import { Constants } from './common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { createDatabaseIfNotExists } from './common/modules';
import { AppDataSource } from './common/modules/database/postgres.config';
import { SeederDataSource } from './common/modules/database/seeder.config';

async function bootstrap() {
    await createDatabaseIfNotExists(AppDataSource);

    if (!SeederDataSource.isInitialized) {
        await SeederDataSource.initialize();
        console.log(1);
    }
    console.log(await SeederDataSource.runMigrations());

    await SeederDataSource.destroy();

    const logger = new Logger(bootstrap.name.toUpperCase());
    const app = await NestFactory.create(AppModule);
    const httpAdapterHost = app.get(HttpAdapterHost);

    const configService: ConfigService<unknown, boolean> = app.get(ConfigService);

    const APP_PORT = configService.getOrThrow('app.port');
    const SWAGGER_PATH = configService.getOrThrow<string>('swagger.path');
    const SWAGGER_LOGIN = configService.getOrThrow<string>('swagger.login');
    const SWAGGER_PASSWORD = configService.getOrThrow<string>('swagger.password');

    app.use((req, res, next) => {
        if (req.path.includes(SWAGGER_PATH)) {
            return basicAuth({
                challenge: true,
                users: { [SWAGGER_LOGIN]: SWAGGER_PASSWORD },
            })(req, res, next);
        }
        return next();
    });

    app.setGlobalPrefix('api/v1');
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // FIXME: по факту можно еще увести в отдельно в setup то что связанно с сваггером, но не стал запариваться
    const config = new DocumentBuilder()
        .setTitle(packageJson.name)
        .setVersion(packageJson.version)
        .addBearerAuth(Constants.swagger.DEFAULT_AUTH_CONFIG, Constants.swagger.ACCESS_TOKEN_KEY)
        .addBearerAuth(Constants.swagger.DEFAULT_AUTH_CONFIG, Constants.swagger.REFRESH_TOKEN_KEY)
        .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(SWAGGER_PATH, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(APP_PORT, '0.0.0.0');

    const url = await app.getUrl();
    logger.log(`Gateway started on ${url}`);
    logger.log(`Swagger UI available on ${url}/${SWAGGER_PATH}`);
    logger.log(`Swagger JSON available on ${url}/${SWAGGER_PATH}-json`);
}
bootstrap();
