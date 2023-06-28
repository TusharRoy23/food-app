import { MigrationInterface, QueryRunner } from "typeorm";

export class orderStatusChanged1668270419689 implements MigrationInterface {
    name = 'orderStatusChanged1668270419689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_order_status_enum" RENAME TO "order_order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_order_status_enum" AS ENUM('pending', 'released', 'on shipping', 'paid', 'cancelled', 'in progress')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" TYPE "public"."order_order_status_enum" USING "order_status"::"text"::"public"."order_order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_order_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_order_status_enum_old" AS ENUM('pending', 'released', 'paid', 'cancelled', 'in progress')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" TYPE "public"."order_order_status_enum_old" USING "order_status"::"text"::"public"."order_order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "order_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_order_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_order_status_enum_old" RENAME TO "order_order_status_enum"`);
    }

}
