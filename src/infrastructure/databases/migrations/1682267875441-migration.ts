import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1682267875441 implements MigrationInterface {
    name = 'Migration1682267875441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ADD "maxUse" bigint`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "countryId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "countryId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "countryId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "countryId" bigint`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "maxUse"`);
    }

}
