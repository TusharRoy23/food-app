import { MigrationInterface, QueryRunner } from "typeorm";

export class productEntityUpdated1653761297902 implements MigrationInterface {
    name = 'productEntityUpdated1653761297902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('active', 'inactive', 'obsolete', 'experimental', 'waiting')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "status" "public"."product_status_enum" NOT NULL DEFAULT 'waiting'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
    }

}
