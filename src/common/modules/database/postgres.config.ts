import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
    path: [join(process.cwd(), '.env.local'), join(process.cwd(), '.env')],
});

const configService = new ConfigService();
const migrationsPath = join(process.cwd(), 'dist', 'migrations', '*.js');
const entitiesPath = join(process.cwd(), 'dist', 'src', 'modules', '**', 'entities', '*.entity.js');

const options = (): DataSourceOptions => ({
    type: 'postgres',
    host: configService.getOrThrow('PG_HOST'),
    port: configService.getOrThrow('PG_PORT'),
    username: configService.getOrThrow('PG_USERNAME'),
    password: configService.getOrThrow('PG_PASS'),
    database: configService.getOrThrow('PG_DB'),
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsTableName: 'migrations',
    migrationsTransactionMode: 'each',
    migrationsRun: true,
    synchronize: false,
});

export const AppDataSource = new DataSource(options());
