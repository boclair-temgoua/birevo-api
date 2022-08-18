import { MigrationInterface, QueryRunner } from 'typeorm';

export class Activity1660644440637 implements MigrationInterface {
  name = 'Activity1660644440637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "activityAbleType" character varying, "activityAbleId" bigint, "action" character varying(30), "ipLocation" character varying, "browser" character varying, "os" character varying, "platform" character varying, "source" character varying, "applicationId" bigint, "userCreatedId" bigint, "usage" bigint, "view" bigint, CONSTRAINT "UQ_d848e62c1a30e6fd2091b935c43" UNIQUE ("uuid"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "validity"`);
  }
}
