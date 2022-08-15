import { DataSource, DataSourceOptions } from 'typeorm';
import { configurations } from '../../configurations/index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configurations.database.host,
  port: configurations.database.port,
  username: configurations.database.username,
  password: configurations.database.password,
  database: configurations.database.name,
  ssl: configurations.database.ssl === 'true' ? true : false,
  extra:
    configurations.database.ssl === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: configurations.database.logging === 'true' ? true : false,
  entities: [`${__dirname}/../../../models/**/*.{ts,js}`],
  migrations: [`${__dirname}/../migrations/**/*.{ts,js}`],
  migrationsRun: false,
  autoLoadEntities: true,
} as DataSourceOptions);
