import { MigrationInterface, QueryRunner } from "typeorm";

export class productmigration1652006799383 implements MigrationInterface {
    name = 'productmigration1652006799383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "title" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "name" TO "title"`);
    }

}
