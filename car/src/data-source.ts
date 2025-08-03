import { DataSource, DataSourceOptions, MigrationExecutor } from 'typeorm';
import * as path from 'path';

const baseConfig: Partial<DataSourceOptions> = {
  type: 'sqlite',
  synchronize: false,
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  logging: false,
};

let environmentConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    environmentConfig = {
      database: 'db.sqlite',
      entities: [path.join(__dirname, '**', '*.entity.js')],
    };
    break;
  case 'test':
    environmentConfig = {
      database: 'test.sqlite',
      entities: [path.join(__dirname, '**', '*.entity.ts')],
      migrationsRun: true,
    };
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

export const AppDataSource = new DataSource({
  ...baseConfig,
  ...environmentConfig,
});
