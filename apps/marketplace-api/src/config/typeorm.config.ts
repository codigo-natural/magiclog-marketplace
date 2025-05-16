import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as dotenv from 'dotenv';

if (process.env.RUNNING_TYPEORM_CLI) {
  dotenv.config({ path: join(__dirname, '..', '..', '.env') });
}


export const getTypeOrmConfig = (configService?: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService ? configService.get<string>('NODE_ENV') : process.env.NODE_ENV;
  const dbSslRequired = configService ? configService.get<string>('DB_SSL_REQUIRED') : process.env.DB_SSL_REQUIRED;

  const entitiesPath = [
    join(__dirname, '..', '**', '*.entity{.ts,.js}')
  ];

  const migrationsPathForCli = [join(process.cwd(), 'dist', 'db', 'migrations', '*{.js,.ts}')];
  const migrationsPathForApp = [join(__dirname, '..', '..', 'db', 'migrations', '*{.js,.ts}')];


  return {
    type: 'postgres',
    host: process.env.DB_HOST || configService?.get<string>('DB_HOST'),
    port: parseInt(process.env.DB_PORT || configService?.get<string>('DB_PORT') || '5432', 10),
    username: process.env.DB_USER || configService?.get<string>('DB_USER'),
    password: process.env.DB_PASSWORD || configService?.get<string>('DB_PASSWORD'),
    database: process.env.DB_NAME || configService?.get<string>('DB_NAME'),
    entities: entitiesPath,
    synchronize: nodeEnv !== 'production',
    migrationsRun: nodeEnv === 'production',
    migrations: nodeEnv === 'production' || process.env.RUNNING_TYPEORM_CLI ? migrationsPathForCli : migrationsPathForApp,
    ssl: dbSslRequired === 'true'
      ? { rejectUnauthorized: false }
      : false,
    logging: nodeEnv !== 'production',
  };
};