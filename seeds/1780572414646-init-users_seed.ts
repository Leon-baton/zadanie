import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUsersSeed1780572414646 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const userId = 1;
        const initialBalance = 12345.6;

        await queryRunner.query(
            `
                INSERT INTO "users" ("id", "balance") 
                VALUES ($1, $2)
                ON CONFLICT ("id") DO NOTHING;
            `,
            [userId, initialBalance],
        );

        await queryRunner.query(
            `
                INSERT INTO "transaction_history" ("id", "userId", "action", "amount", "ts")
                VALUES (gen_random_uuid(), $1, 'top_up', $2, NOW())
                ON CONFLICT DO NOTHING;
            `,
            [userId, initialBalance],
        );

        await queryRunner.query(`
            SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM "users";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userId = 1;

        await queryRunner.query(
            `
                DELETE FROM "transaction_history" WHERE "userId" = $1;
            `,
            [userId],
        );

        await queryRunner.query(
            `
                DELETE FROM "users" WHERE "id" = $1;
            `,
            [userId],
        );
    }
}
