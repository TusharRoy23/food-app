import { MigrationInterface, QueryRunner } from "typeorm";

export class userentity1653029602866 implements MigrationInterface {
    name = 'userentity1653029602866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "hashPassword" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "password" TO "hashPassword"`);
    }

}
