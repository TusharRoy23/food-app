import { MigrationInterface, QueryRunner } from "typeorm";

export class restaurentRatingEntity1668613270208 implements MigrationInterface {
    name = 'restaurentRatingEntity1668613270208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "restaurent_rating" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "star" integer NOT NULL, "rating_date" TIMESTAMP NOT NULL, "restaurentId" integer, "userId" integer, CONSTRAINT "PK_251466842ad95393b10de294a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurent_rating" ADD CONSTRAINT "FK_c3ed3bc49a4b3b2c439b5aa081b" FOREIGN KEY ("restaurentId") REFERENCES "restaurent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurent_rating" ADD CONSTRAINT "FK_92e2652f8f6250d3b25a1fb61a3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurent_rating" DROP CONSTRAINT "FK_92e2652f8f6250d3b25a1fb61a3"`);
        await queryRunner.query(`ALTER TABLE "restaurent_rating" DROP CONSTRAINT "FK_c3ed3bc49a4b3b2c439b5aa081b"`);
        await queryRunner.query(`DROP TABLE "restaurent_rating"`);
    }

}
