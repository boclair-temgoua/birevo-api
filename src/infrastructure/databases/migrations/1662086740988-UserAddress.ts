import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddress1662086740988 implements MigrationInterface {
    name = 'UserAddress1662086740988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_address" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL, "company" character varying, "city" character varying, "phone" character varying, "region" character varying, "street1" character varying, "street2" character varying, "cap" character varying, "countryId" bigint, "userId" bigint, "organizationId" bigint, CONSTRAINT "UQ_dadbe54c4732e6f266aacd15ad6" UNIQUE ("uuid"), CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_640e370946e53d3117c038ef36a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_640e370946e53d3117c038ef36a"`);
        await queryRunner.query(`DROP TABLE "user_address"`);
    }

}
