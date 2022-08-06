import { MigrationInterface, QueryRunner } from 'typeorm';

import { faker } from '@faker-js/faker';

export class Seeds1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    console.log('\x1b[32m%s\x1b[0m', '**** Country seed finish ****');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}
