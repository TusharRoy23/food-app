import { MigrationInterface, QueryRunner } from "typeorm";

export class userEntityUpdated1653935475840 implements MigrationInterface {
    name = 'userEntityUpdated1653935475840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d"`);
        await queryRunner.query(`CREATE TYPE "public"."user_info_role_enum" AS ENUM('visitor', 'restaurent-user', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "user_info" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying, "role" "public"."user_info_role_enum" NOT NULL DEFAULT 'visitor', "restaurentId" integer, CONSTRAINT "REL_9e556b83c8a771e2f624287773" UNIQUE ("restaurentId"), CONSTRAINT "PK_273a06d6cdc2085ee1ce7638b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_3a951dac8c758ec5a8757f5976"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "restaurentId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "uuid" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userInfoId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5c634c605ff93c4ac0f1be62f00" UNIQUE ("userInfoId")`);
        await queryRunner.query(`ALTER TABLE "restaurent" ADD "uuid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "uuid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c634c605ff93c4ac0f1be62f00" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "FK_9e556b83c8a771e2f624287773d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "FK_9e556b83c8a771e2f624287773d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c634c605ff93c4ac0f1be62f00"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "restaurent" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5c634c605ff93c4ac0f1be62f00"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userInfoId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "restaurentId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_3a951dac8c758ec5a8757f5976" UNIQUE ("restaurentId")`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('visitor', 'restaurent-user', 'superadmin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'visitor'`);
        await queryRunner.query(`DROP TABLE "user_info"`);
        await queryRunner.query(`DROP TYPE "public"."user_info_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
