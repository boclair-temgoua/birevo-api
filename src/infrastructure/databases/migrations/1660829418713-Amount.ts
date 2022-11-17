import { MigrationInterface, QueryRunner } from 'typeorm';

export class Amount1660829418713 implements MigrationInterface {
  name = 'Amount1660829418713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "amount" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "token" character varying, "invoiceNumber" character varying, "urlFile" character varying, "amount" double precision, "currency" character varying, "type" character varying, "paymentMethod" character varying, "description" character varying, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, CONSTRAINT "PK_a477ff5de83a86ac715bb5ddac9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "amount_usage" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amountUsage" double precision, "amountId" bigint, "userId" bigint, "organizationId" bigint, CONSTRAINT "REL_0eec630bedb5618739b1c3c879" UNIQUE ("amountId"), CONSTRAINT "PK_011769b7625deccbd14e16221d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" ADD CONSTRAINT "FK_689972109e31c6b68377e08660f" FOREIGN KEY ("amountId") REFERENCES "amount"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" ADD CONSTRAINT "FK_8fafac85a174cca641b5a9b8d94" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "amount_usage" DROP CONSTRAINT "FK_8fafac85a174cca641b5a9b8d94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_usage" DROP CONSTRAINT "FK_689972109e31c6b68377e08660f"`,
    );
    await queryRunner.query(`DROP TABLE "amount_usage"`);
    await queryRunner.query(`DROP TABLE "amount"`);
  }
}
