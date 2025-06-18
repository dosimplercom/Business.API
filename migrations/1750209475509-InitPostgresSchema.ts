import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPostgresSchema1750209475509 implements MigrationInterface {
    name = 'InitPostgresSchema1750209475509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "email_verified" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "phone_verified" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "phone_verified" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ALTER COLUMN "email_verified" DROP NOT NULL`);
    }

}
