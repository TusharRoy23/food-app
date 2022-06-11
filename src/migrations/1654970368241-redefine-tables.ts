import { MigrationInterface, QueryRunner } from "typeorm";

export class redefineTables1654970368241 implements MigrationInterface {
    name = 'redefineTables1654970368241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_info" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying, "address" text, CONSTRAINT "PK_273a06d6cdc2085ee1ce7638b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_user_type_enum" AS ENUM('visitor', 'restaurent-user', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('none', 'owner', 'employee', 'superadmin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_current_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "user_type" "public"."user_user_type_enum" NOT NULL DEFAULT 'visitor', "role" "public"."user_role_enum" NOT NULL DEFAULT 'none', "current_status" "public"."user_current_status_enum" NOT NULL DEFAULT 'active', "restaurentId" integer, "userInfoId" integer, CONSTRAINT "REL_5c634c605ff93c4ac0f1be62f0" UNIQUE ("userInfoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."restaurent_current_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "restaurent" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "address" text NOT NULL, "profile_img" text, "opening_time" TIME NOT NULL, "closing_time" TIME NOT NULL, "current_status" "public"."restaurent_current_status_enum" NOT NULL DEFAULT 'inactive', CONSTRAINT "PK_16ebda7a2d42f26c95f7b635e7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4b1bec600cffe139803314f721" ON "restaurent" ("name") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c634c605ff93c4ac0f1be62f00" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c634c605ff93c4ac0f1be62f00"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b1bec600cffe139803314f721"`);
        await queryRunner.query(`DROP TABLE "restaurent"`);
        await queryRunner.query(`DROP TYPE "public"."restaurent_current_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_current_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_user_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_info"`);
    }

}
