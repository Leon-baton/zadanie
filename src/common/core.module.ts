import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, redisConfig, swaggerConfig } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/redis.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
            load: [appConfig, swaggerConfig, redisConfig],
        }),
        CacheModule.register(),
        DatabaseModule,
        RedisModule,
    ],
    exports: [DatabaseModule, RedisModule],
})
export class CoreModule {}
