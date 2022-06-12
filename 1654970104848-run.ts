import { MigrationInterface, QueryRunner } from "typeorm";

export class run1654970104848 implements MigrationInterface {
    name = 'run1654970104848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "FK_9e556b83c8a771e2f624287773d"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "FK_3a7fa0c3809d19eaf2fb4f65949"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_info_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "REL_9e556b83c8a771e2f624287773"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "restaurentId"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_3a7fa0c3809d19eaf2fb4f65949"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "address" text`);
        await queryRunner.query(`CREATE TYPE "public"."user_user_type_enum" AS ENUM('visitor', 'restaurent-user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "user_type" "public"."user_user_type_enum" NOT NULL DEFAULT 'visitor'`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('none', 'owner', 'employee', 'superadmin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'none'`);
        await queryRunner.query(`CREATE TYPE "public"."user_current_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "current_status" "public"."user_current_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "restaurentId" integer`);
        await queryRunner.query(`ALTER TABLE "restaurent" ADD "profile_img" text`);
        await queryRunner.query(`ALTER TABLE "restaurent" ADD "opening_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurent" ADD "closing_time" TIME NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."restaurent_current_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "restaurent" ADD "current_status" "public"."restaurent_current_status_enum" NOT NULL DEFAULT 'inactive'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "uuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a951dac8c758ec5a8757f5976d"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "uuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurent" DROP COLUMN "current_status"`);
        await queryRunner.query(`DROP TYPE "public"."restaurent_current_status_enum"`);
        await queryRunner.query(`ALTER TABLE "restaurent" DROP COLUMN "closing_time"`);
        await queryRunner.query(`ALTER TABLE "restaurent" DROP COLUMN "opening_time"`);
        await queryRunner.query(`ALTER TABLE "restaurent" DROP COLUMN "profile_img"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "restaurentId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "current_status"`);
        await queryRunner.query(`DROP TYPE "public"."user_current_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_3a7fa0c3809d19eaf2fb4f65949" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "restaurentId" integer`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "REL_9e556b83c8a771e2f624287773" UNIQUE ("restaurentId")`);
        await queryRunner.query(`CREATE TYPE "public"."user_info_role_enum" AS ENUM('visitor', 'restaurent-user', 'superadmin')`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "role" "public"."user_info_role_enum" NOT NULL DEFAULT 'visitor'`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "FK_3a7fa0c3809d19eaf2fb4f65949" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "FK_9e556b83c8a771e2f624287773d" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
