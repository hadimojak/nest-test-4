// src/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...AppDataSource.options,
  autoLoadEntities: true,
};
