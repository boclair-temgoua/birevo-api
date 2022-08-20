import { MigrationInterface, QueryRunner } from "typeorm";

export class Amount1660829418713 implements MigrationInterface {
    name = 'Amount1660829418713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amount" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amount" double precision, "currency" character varying, "paymentMethod" character varying, "userId" bigint, "organizationId" bigint, "userCreatedId" bigint, CONSTRAINT "PK_a477ff5de83a86ac715bb5ddac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "amount_subscription" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" BIGSERIAL NOT NULL, "amountSubscription" double precision, "amountId" bigint, "userId" bigint, "organizationId" bigint, CONSTRAINT "REL_0eec630bedb5618739b1c3c879" UNIQUE ("amountId"), CONSTRAINT "PK_011769b7625deccbd14e16221d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "useragent"`);
        await queryRunner.query(`ALTER TABLE "amount_subscription" ADD CONSTRAINT "FK_0eec630bedb5618739b1c3c8793" FOREIGN KEY ("amountId") REFERENCES "amount"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "amount_subscription" ADD CONSTRAINT "FK_79e88108f3a6c6cbac9b07b6758" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "amount_subscription" DROP CONSTRAINT "FK_79e88108f3a6c6cbac9b07b6758"`);
        await queryRunner.query(`ALTER TABLE "amount_subscription" DROP CONSTRAINT "FK_0eec630bedb5618739b1c3c8793"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "useragent" text`);
        await queryRunner.query(`DROP TABLE "amount_subscription"`);
        await queryRunner.query(`DROP TABLE "amount"`);
    }

}
