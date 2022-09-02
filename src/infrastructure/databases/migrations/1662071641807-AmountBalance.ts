import { MigrationInterface, QueryRunner } from 'typeorm';

export class AmountBalance1662071641807 implements MigrationInterface {
  name = 'AmountBalance1662071641807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "amount_balance" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amountBalance" double precision, "amountId" bigint, "userId" bigint, "organizationId" bigint, "monthAmountBalanceAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5d5b631a0329b2d4f1c68ff84d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "amount_balance" ADD CONSTRAINT "FK_742c3a03b0322faf1ba49ac4090" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "amount_balance" DROP CONSTRAINT "FK_742c3a03b0322faf1ba49ac4090"`,
    );
    await queryRunner.query(`DROP TABLE "amount_balance"`);
  }
}
