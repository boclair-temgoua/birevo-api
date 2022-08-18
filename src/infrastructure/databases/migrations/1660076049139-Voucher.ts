import { MigrationInterface, QueryRunner } from 'typeorm';

export class Voucher1660076049139 implements MigrationInterface {
  name = 'Voucher1660076049139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "voucher" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "validity" TIMESTAMP WITH TIME ZONE, "id" BIGSERIAL NOT NULL, "usedAt" TIMESTAMP WITH TIME ZONE, "uuid" uuid NOT NULL, "code" character varying NOT NULL, "voucherCategoryId" bigint, "currencyId" bigint, "voucherType" character varying(30) NOT NULL DEFAULT 'COUPON', "statusOnline" character varying(30) NOT NULL DEFAULT 'ONLINE', "status" character varying(30) NOT NULL DEFAULT 'PENDING', "name" character varying, "email" character varying, "description" character varying, "amount" double precision, "percent" double precision, "deliveryType" character varying, "startedAt" TIMESTAMP WITH TIME ZONE, "expiredAt" TIMESTAMP WITH TIME ZONE, "userTransactionId" bigint, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, "applicationId" bigint, CONSTRAINT "UQ_8f5954b720a3fbcd072858dd68a" UNIQUE ("uuid"), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" ADD CONSTRAINT "FK_80a57d757e0be8225f261c7994f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" ADD CONSTRAINT "FK_5626587e9ce7299175866751533" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voucher" DROP CONSTRAINT "FK_5626587e9ce7299175866751533"`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher" DROP CONSTRAINT "FK_80a57d757e0be8225f261c7994f"`,
    );
    await queryRunner.query(`DROP TABLE "voucher"`);
  }
}
