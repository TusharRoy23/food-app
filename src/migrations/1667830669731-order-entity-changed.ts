import { MigrationInterface, QueryRunner } from "typeorm";

export class orderEntityChanged1667830669731 implements MigrationInterface {
    name = 'orderEntityChanged1667830669731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "deduction_rate"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "orderDiscountId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_66f20a6225d43d0f5b296394419" FOREIGN KEY ("orderDiscountId") REFERENCES "order_discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_66f20a6225d43d0f5b296394419"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderDiscountId"`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "deduction_rate" double precision DEFAULT '0'`);
    }

}
