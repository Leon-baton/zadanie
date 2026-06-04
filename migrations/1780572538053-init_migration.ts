import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1780572538053 implements MigrationInterface {
    name = 'InitMigration1780572538053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_history_action_enum" AS ENUM('top_up', 'purchase')`);
        await queryRunner.query(`CREATE TABLE "transaction_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer NOT NULL, "action" "public"."transaction_history_action_enum" NOT NULL, "amount" numeric(10,2) NOT NULL, "ts" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD CONSTRAINT "FK_8bdc31e84262ee1bbfcb63ab257" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "FK_8bdc31e84262ee1bbfcb63ab257"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "transaction_history"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_history_action_enum"`);
    }

}
