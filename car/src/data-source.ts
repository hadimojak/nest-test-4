import { DataSource, DataSourceOptions, MigrationExecutor } from 'typeorm';
import * as path from 'path';

const baseConfig: Partial<DataSourceOptions> = {
  synchronize: false,
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  logging: false,
};

let environmentConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    environmentConfig = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.join(__dirname, '**', '*.entity.js')],
    };
    break;
  case 'test':
    environmentConfig = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [path.join(__dirname, '**', '*.entity.ts')],
      migrationsRun: true,
    };
    break;
  case 'production':
    environmentConfig = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [path.join(__dirname, '**', '*.entity.js')],
      migrationsRun: true,
      ssl: { rejectUnauthorized: false },
    };
    break;
  default:
    throw new Error('unknown environment');
}

export const AppDataSource = new DataSource({
  ...baseConfig,
  ...environmentConfig,
});
