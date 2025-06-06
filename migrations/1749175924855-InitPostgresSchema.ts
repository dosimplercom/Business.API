import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPostgresSchema1749175924855 implements MigrationInterface {
    name = 'InitPostgresSchema1749175924855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sys_state" DROP CONSTRAINT "state_country_id_fkey"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "sys_country_id_seq" OWNED BY "sys_country"."id"`);
        await queryRunner.query(`ALTER TABLE "sys_country" ALTER COLUMN "id" SET DEFAULT nextval('"sys_country_id_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "sys_state_id_seq" OWNED BY "sys_state"."id"`);
        await queryRunner.query(`ALTER TABLE "sys_state" ALTER COLUMN "id" SET DEFAULT nextval('"sys_state_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "contact_detail" DROP CONSTRAINT "contact_detail_sys_contact_detail_type_id_fkey"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "sys_contact_detail_type_id_seq" OWNED BY "sys_contact_detail_type"."id"`);
        await queryRunner.query(`ALTER TABLE "sys_contact_detail_type" ALTER COLUMN "id" SET DEFAULT nextval('"sys_contact_detail_type_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "sys_state" ADD CONSTRAINT "state_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "sys_country"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_detail" ADD CONSTRAINT "contact_detail_sys_contact_detail_type_id_fkey" FOREIGN KEY ("sys_contact_detail_type_id") REFERENCES "sys_contact_detail_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_detail" DROP CONSTRAINT "contact_detail_sys_contact_detail_type_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "sys_state" DROP CONSTRAINT "state_country_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "sys_contact_detail_type" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "sys_contact_detail_type_id_seq"`);
        await queryRunner.query(`ALTER TABLE "contact_detail" ADD CONSTRAINT "contact_detail_sys_contact_detail_type_id_fkey" FOREIGN KEY ("sys_contact_detail_type_id") REFERENCES "sys_contact_detail_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sys_state" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "sys_state_id_seq"`);
        await queryRunner.query(`ALTER TABLE "sys_country" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "sys_country_id_seq"`);
        await queryRunner.query(`ALTER TABLE "sys_state" ADD CONSTRAINT "state_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "sys_country"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
