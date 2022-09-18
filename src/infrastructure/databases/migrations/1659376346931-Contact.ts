import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1659376346931 implements MigrationInterface {
  name = 'Contact1659376346931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contact" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "isRed" boolean NOT NULL DEFAULT false, "slug" character varying, "fullName" character varying, "countryId" bigint, "email" character varying, "phone" character varying, "description" text, "userId" bigint, CONSTRAINT "UQ_126b452db77c24d32b5885f4468" UNIQUE ("uuid"), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact"`);
  }
}
