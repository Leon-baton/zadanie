import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
    path: [join(process.cwd(), '.env.local'), join(process.cwd(), '.env')],
});

const configService = new ConfigService();

const seedsPath = join(process.cwd(), 'dist', 'seeds', '*seed.js');

const options = (): DataSourceOptions => ({
    type: 'postgres',
    host: configService.getOrThrow('PG_HOST'),
    port: configService.getOrThrow('PG_PORT'),
    username: configService.getOrThrow('PG_USERNAME'),
    password: configService.getOrThrow('PG_PASS'),
    database: configService.getOrThrow('PG_DB'),
    migrations: [seedsPath],
    migrationsRun: true,
    synchronize: false,
    migrationsTableName: 'seeds',
});

export const SeederDataSource = new DataSource(options());
