import { MigrationInterface, QueryRunner } from 'typeorm';

export class Faq1662563302359 implements MigrationInterface {
  name = 'Faq1662563302359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "faq" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "status" boolean NOT NULL DEFAULT true, "slug" character varying, "type" character varying, "title" character varying, "description" text, "userCreatedId" bigint, "userId" bigint, CONSTRAINT "UQ_48bba3278d848b2f074cacfbb15" UNIQUE ("uuid"), CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "faq"`);
  }
}
