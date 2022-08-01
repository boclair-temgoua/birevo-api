import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1659379645909 implements MigrationInterface {
  name = 'User1659379645909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid, "email" character varying, "username" character varying, "password" character varying, "noHashPassword" character varying, "profileId" bigint, "organizationInUtilizationId" bigint, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "firstName" character varying, "currencyId" bigint, "image" character varying, "lastName" character varying, CONSTRAINT "UQ_fab5f83a1cc8ebe0076c733fd85" UNIQUE ("uuid"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
