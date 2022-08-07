import { MigrationInterface, QueryRunner } from "typeorm";

export class Application1659901643748 implements MigrationInterface {
    name = 'Application1659901643748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "name" character varying, "color" character varying, "statusOnline" character varying(30) NOT NULL DEFAULT 'ONLINE', "userId" bigint, "userCreatedId" bigint, CONSTRAINT "UQ_71af2cd4dccba665296d4befbfe" UNIQUE ("uuid"), CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_token" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "userId" bigint, "userCreatedId" bigint, "applicationId" bigint, "organizationId" bigint, "token" character varying, CONSTRAINT "UQ_b52a8f306d16385f00594b1edb9" UNIQUE ("uuid"), CONSTRAINT "PK_1e5d54602620099c1e7ccf7ae47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_token" ADD CONSTRAINT "FK_13c7a1841ed6ca37889ec1e3d99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_token" ADD CONSTRAINT "FK_05ac6b43d94110a9f863998f380" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_token" DROP CONSTRAINT "FK_05ac6b43d94110a9f863998f380"`);
        await queryRunner.query(`ALTER TABLE "application_token" DROP CONSTRAINT "FK_13c7a1841ed6ca37889ec1e3d99"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_b4ae3fea4a24b4be1a86dacf8a2"`);
        await queryRunner.query(`DROP TABLE "application_token"`);
        await queryRunner.query(`DROP TABLE "application"`);
    }

}
