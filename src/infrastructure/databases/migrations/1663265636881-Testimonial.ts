import { MigrationInterface, QueryRunner } from 'typeorm';

export class Testimonial1663265636881 implements MigrationInterface {
  name = 'Testimonial1663265636881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "testimonial" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "fullName" character varying, "occupation" character varying, "rete" integer, "image" character varying, "link" character varying, "description" text, "userCreatedId" bigint, "userId" bigint, CONSTRAINT "UQ_5f9dc688fc1167f6fb214e7eb18" UNIQUE ("uuid"), CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "testimonial"`);
  }
}
