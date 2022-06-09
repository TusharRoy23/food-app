import { MigrationInterface, QueryRunner } from "typeorm";

export class userEntityUpdated1653936781322 implements MigrationInterface {
    name = 'userEntityUpdated1653936781322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_3a7fa0c3809d19eaf2fb4f65949" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "FK_3a7fa0c3809d19eaf2fb4f65949" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "FK_3a7fa0c3809d19eaf2fb4f65949"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_3a7fa0c3809d19eaf2fb4f65949"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "userId"`);
    }

}
