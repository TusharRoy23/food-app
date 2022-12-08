import { MigrationInterface, QueryRunner } from "typeorm";

export class ItemEntity1655448974095 implements MigrationInterface {
    name = 'ItemEntity1655448974095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."item_item_type_enum" AS ENUM('food', 'drink', 'alcohol', 'Victuals')`);
        await queryRunner.query(`CREATE TYPE "public"."item_meal_type_enum" AS ENUM('daily food', 'fast food', 'snacks', 'burgers', 'meat', 'fish', 'beverage', 'dessert', 'kebab', 'alcohol')`);
        await queryRunner.query(`CREATE TYPE "public"."item_meal_state_enum" AS ENUM('hot', 'cold', 'normal')`);
        await queryRunner.query(`CREATE TYPE "public"."item_meal_flavor_enum" AS ENUM('sweet', 'spicy', 'salty', 'sour', 'bitter', 'savory')`);
        await queryRunner.query(`CREATE TYPE "public"."item_item_status_enum" AS ENUM('active', 'inactive', 'obsolete', 'experimental', 'waiting')`);
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "name" character varying NOT NULL, "icon" text, "image" text, "item_type" "public"."item_item_type_enum" NOT NULL DEFAULT 'food', "meal_type" "public"."item_meal_type_enum" NOT NULL DEFAULT 'fast food', "meal_state" "public"."item_meal_state_enum" NOT NULL DEFAULT 'hot', "meal_flavor" "public"."item_meal_flavor_enum" NOT NULL DEFAULT 'sweet', "price" double precision NOT NULL DEFAULT '0', "discount_start_date" TIMESTAMP, "discount_end_date" TIMESTAMP, "discount_rate" double precision DEFAULT '0', "item_status" "public"."item_item_status_enum" NOT NULL DEFAULT 'active', "restaurentId" integer, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."user_current_status_enum" RENAME TO "user_current_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_current_status_enum" AS ENUM('active', 'inactive', 'not-verified', 'verified')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" TYPE "public"."user_current_status_enum" USING "current_status"::"text"::"public"."user_current_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."user_current_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."restaurent_current_status_enum" RENAME TO "restaurent_current_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."restaurent_current_status_enum" AS ENUM('active', 'inactive', 'not-verified', 'verified')`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" TYPE "public"."restaurent_current_status_enum" USING "current_status"::"text"::"public"."restaurent_current_status_enum"`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" SET DEFAULT 'not-verified'`);
        await queryRunner.query(`DROP TYPE "public"."restaurent_current_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_609bb3e26c9bac9878a95704ceb" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_609bb3e26c9bac9878a95704ceb"`);
        await queryRunner.query(`CREATE TYPE "public"."restaurent_current_status_enum_old" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" TYPE "public"."restaurent_current_status_enum_old" USING "current_status"::"text"::"public"."restaurent_current_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "restaurent" ALTER COLUMN "current_status" SET DEFAULT 'inactive'`);
        await queryRunner.query(`DROP TYPE "public"."restaurent_current_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."restaurent_current_status_enum_old" RENAME TO "restaurent_current_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_current_status_enum_old" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" TYPE "public"."user_current_status_enum_old" USING "current_status"::"text"::"public"."user_current_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "current_status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."user_current_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_current_status_enum_old" RENAME TO "user_current_status_enum"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TYPE "public"."item_item_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_meal_flavor_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_meal_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_meal_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."item_item_type_enum"`);
    }

}
