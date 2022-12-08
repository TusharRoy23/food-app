import { MigrationInterface, QueryRunner } from "typeorm";

export class itemEntityUpdated1655741042671 implements MigrationInterface {
    name = 'itemEntityUpdated1655741042671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."item_item_status_enum" RENAME TO "item_item_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."item_item_status_enum" AS ENUM('active', 'inactive', 'obsolete', 'experimental', 'waiting', 'deleted')`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" TYPE "public"."item_item_status_enum" USING "item_status"::"text"::"public"."item_item_status_enum"`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."item_item_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."item_item_status_enum_old" AS ENUM('active', 'inactive', 'obsolete', 'experimental', 'waiting')`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" TYPE "public"."item_item_status_enum_old" USING "item_status"::"text"::"public"."item_item_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "item_status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."item_item_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."item_item_status_enum_old" RENAME TO "item_item_status_enum"`);
    }

}
