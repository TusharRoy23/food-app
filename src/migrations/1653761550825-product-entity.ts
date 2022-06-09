import { MigrationInterface, QueryRunner } from "typeorm";

export class productEntity1653761550825 implements MigrationInterface {
    name = 'productEntity1653761550825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdDate"`);
    }

}
