import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataMigrationSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5435,
  username: 'gmadmin',
  password: 'gmadminpass',
  database: 'db_berivo_v2',
  logging: true,
  synchronize: false,
  migrationsRun: false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../migrations/**/*.{ts,js}`],
} as DataSourceOptions);
