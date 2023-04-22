import { DataSource, DataSourceOptions } from 'typeorm';
import { configurations } from '../../configurations/index';

export const AppSeedDataSource = new DataSource({
  // url: configurations.database.url,
  type: configurations.database.postgres.type,
  host: configurations.database.postgres.host,
  port: configurations.database.postgres.port,
  username: configurations.database.postgres.username,
  password: configurations.database.postgres.password,
  database: configurations.database.postgres.name,
  ssl: configurations.database.postgres.ssl === 'true' ? true : false,
  extra:
    configurations.database.postgres.ssl === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: configurations.database.postgres.logging === 'true' ? true : false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../seeds/**/*.{ts,js}`],
  migrationsRun: false,
} as DataSourceOptions);
