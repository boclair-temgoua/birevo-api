import { DataSource, DataSourceOptions } from 'typeorm';
import { configurations } from '../../configurations/index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // url: 'postgres://birevo:imJnx7iVY84XglRfwlAjKuNaoerzbM1c@dpg-cceau51a6gdgjihboru0-a.frankfurt-postgres.render.com/bqontejiencmgf',
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
