import { MigrationInterface, QueryRunner } from "typeorm";

export class majorEntityChanges1652026058752 implements MigrationInterface {
    name = 'majorEntityChanges1652026058752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('visitor', 'restaurent-user', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hashPassword" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'visitor', "restaurentId" integer, CONSTRAINT "REL_3a951dac8c758ec5a8757f5976" UNIQUE ("restaurentId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "restaurent" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" text NOT NULL, CONSTRAINT "PK_16ebda7a2d42f26c95f7b635e7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4b1bec600cffe139803314f721" ON "restaurent" ("name") `);
        await queryRunner.query(`ALTER TABLE "product" ADD "restaurentId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_f905cc579066547d986af8a317c" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_f905cc579066547d986af8a317c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "restaurentId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b1bec600cffe139803314f721"`);
        await queryRunner.query(`DROP TABLE "restaurent"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
