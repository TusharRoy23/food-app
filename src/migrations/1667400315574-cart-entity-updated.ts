import { MigrationInterface, QueryRunner } from "typeorm";

export class cartEntityUpdated1667400315574 implements MigrationInterface {
    name = 'cartEntityUpdated1667400315574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "rebate_amount" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "rebate_amount"`);
    }

}
