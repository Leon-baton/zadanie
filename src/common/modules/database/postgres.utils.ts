import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';

export async function createDatabaseIfNotExists(dataSource: DataSource) {
    await createDatabase({ options: dataSource.options, ifNotExist: true });
    await dataSource.initialize();
    await dataSource.runMigrations();
}
