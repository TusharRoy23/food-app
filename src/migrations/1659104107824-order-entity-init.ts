import { MigrationInterface, QueryRunner } from "typeorm";

export class orderEntityInit1659104107824 implements MigrationInterface {
    name = 'orderEntityInit1659104107824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_order_status_enum" AS ENUM('pending', 'paid', 'cancelled', 'in progress')`);
        await queryRunner.query(`CREATE TYPE "public"."order_paid_by_enum" AS ENUM('cash on delivery', 'card', 'paid via mobile')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "serial_number" character varying NOT NULL, "order_amount" double precision NOT NULL, "rebate_amount" double precision DEFAULT '0', "order_date" TIMESTAMP NOT NULL, "order_status" "public"."order_order_status_enum" NOT NULL DEFAULT 'pending', "paid_by" "public"."order_paid_by_enum" NOT NULL DEFAULT 'cash on delivery', "userId" integer, "restaurentId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "qty" double precision NOT NULL, "amount" double precision NOT NULL, "deduction_rate" double precision DEFAULT '0', "itemId" integer, "orderId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d1cd4e982720f1bd443074c21ae" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e03f3ed4dab80a3bf3eca50babc" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e03f3ed4dab80a3bf3eca50babc"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d1cd4e982720f1bd443074c21ae"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_paid_by_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_order_status_enum"`);
    }

}
