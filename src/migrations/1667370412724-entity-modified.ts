import { MigrationInterface, QueryRunner } from "typeorm";

export class entityModified1667370412724 implements MigrationInterface {
    name = 'entityModified1667370412724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "restaurent_item" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "sell_count" double precision NOT NULL, "restaurentId" integer, "itemId" integer, CONSTRAINT "PK_e645a6fe07b3599478d31feb575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "total_amount" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "orderDiscountId" integer`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "total_amount" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "total_amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "cart_amount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "qty" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "amount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f7916dd60c2c2ed1d3d99d3e596" FOREIGN KEY ("orderDiscountId") REFERENCES "order_discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurent_item" ADD CONSTRAINT "FK_9ded373026caf5f4a5d07efb281" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurent_item" ADD CONSTRAINT "FK_4ac4e0cccd2bbc835bbb335ec6e" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurent_item" DROP CONSTRAINT "FK_4ac4e0cccd2bbc835bbb335ec6e"`);
        await queryRunner.query(`ALTER TABLE "restaurent_item" DROP CONSTRAINT "FK_9ded373026caf5f4a5d07efb281"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f7916dd60c2c2ed1d3d99d3e596"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "amount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "qty" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "cart_amount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "orderDiscountId"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "total_amount"`);
        await queryRunner.query(`DROP TABLE "restaurent_item"`);
    }

}
