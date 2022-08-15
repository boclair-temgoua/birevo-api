import { MigrationInterface, QueryRunner } from "typeorm";

export class Subscribe1660515710644 implements MigrationInterface {
    name = 'Subscribe1660515710644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "name" character varying, "description" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscribe" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "uuid" uuid, "subscribableType" character varying, "subscribableId" bigint, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, "roleId" bigint, CONSTRAINT "UQ_82ffabeb44a132418751083a09a" UNIQUE ("uuid"), CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_78138550e21d8b67790d761148d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_d72cff242225704046552c5be35" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_0a8185dfb448170d6581765aa19" FOREIGN KEY ("userCreatedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_769e544bd87a6492c15e170cbc0" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_769e544bd87a6492c15e170cbc0"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_0a8185dfb448170d6581765aa19"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_d72cff242225704046552c5be35"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_78138550e21d8b67790d761148d"`);
        await queryRunner.query(`DROP TABLE "subscribe"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
