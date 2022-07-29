import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1641392495501 implements MigrationInterface {
  name = 'Migrations1641392495501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "contact" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid,
                "isRed" boolean NOT NULL DEFAULT false,
                "slug" character varying,
                "fistName" character varying,
                "lastName" character varying,
                "subject" character varying,
                "email" character varying,
                "description" text,
                "userId" bigint,
                CONSTRAINT "UQ_126b452db77c24d32b5885f4468" UNIQUE ("uuid"),
                CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "country" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid,
                "code" character varying NOT NULL DEFAULT false,
                "name" character varying,
                CONSTRAINT "UQ_4e06beff3ecfb1a974312fe536d" UNIQUE ("uuid"),
                CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "notification" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid,
                "userId" bigint,
                "description" character varying,
                "link" character varying,
                "linkPdf" character varying,
                "subject" character varying,
                "isRead" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_b9fa421f94f7707ba109bf73b82" UNIQUE ("uuid"),
                CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "profile" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid NOT NULL,
                "firstName" character varying,
                "image" character varying,
                "color" character varying,
                "lastName" character varying,
                CONSTRAINT "UQ_fab5f83a1cc8ebe0076c733fd85" UNIQUE ("uuid"),
                CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid,
                "username" character varying,
                "email" character varying NOT NULL,
                "password" character varying,
                "noHashPassword" character varying,
                "token" character varying,
                "profileId" bigint,
                "organizationInUtilizationId" bigint,
                "isConfirmEmail" boolean NOT NULL DEFAULT false,
                "role" character varying(30) NOT NULL DEFAULT 'CLIENT',
                "refreshToken" text,
                CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reset_password" (
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "id" SERIAL NOT NULL,
                "email" character varying,
                "accessToken" character varying,
                "token" character varying,
                CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"
        `);
    await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"
        `);
    await queryRunner.query(`
            DROP TABLE "reset_password"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TABLE "profile"
        `);
    await queryRunner.query(`
            DROP TABLE "notification"
        `);
    await queryRunner.query(`
            DROP TABLE "country"
        `);
    await queryRunner.query(`
            DROP TABLE "contact"
        `);
  }
}
