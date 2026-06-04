import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './postgres.config';
import { SeederDataSource } from './seeder.config';

@Global()
@Module({
    imports: [TypeOrmModule.forRoot(AppDataSource.options), TypeOrmModule.forRoot(SeederDataSource.options)],
})
export class DatabaseModule {}
