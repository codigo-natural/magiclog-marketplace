// apps/marketplace-api/src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { join } from 'path';

export const getTypeOrmConfig = (configService?: ConfigService): TypeOrmModuleOptions => {
  const getEnv = (key: string, defaultValue?: any) =>
    configService ? configService.get<string>(key) ?? defaultValue : process.env[key] ?? defaultValue;

  const nodeEnv = getEnv('NODE_ENV');
  const dbSslRequired = getEnv('DB_SSL_REQUIRED');
  const isCli = process.env.RUNNING_TYPEORM_CLI === 'true';

  let entitiesPath: string[];
  let calculatedMigrationsPathForApp: string; // Variable para loguear específicamente

  if (isCli) {
    entitiesPath = [join(process.cwd(), 'src', '**', '*.entity.ts')];
    // Para la CLI ejecutando migraciones, usamos la ruta desde process.cwd() a dist/src/db/migrations
    calculatedMigrationsPathForApp = join(process.cwd(), 'dist', 'src', 'db', 'migrations', '*{.js,.ts}');
  } else {
    // Para la aplicación NestJS en ejecución (dist/src/config/typeorm.config.js)
    // __dirname es .../dist/src/config
    entitiesPath = [join(__dirname, '..', '**', '*.entity.{js,ts}')]; // va a dist/src/**/*.entity.js
    // Para llegar a dist/src/db/migrations desde dist/src/config: ../db/migrations
    calculatedMigrationsPathForApp = join(__dirname, '..', 'db', 'migrations', '*{.js,.ts}');
  }

  // LOGS IMPORTANTES DENTRO DE ESTA FUNCIÓN
  if (!isCli) { // Solo loguear cuando es la app, no la CLI
    console.log(`[getTypeOrmConfig - APP] NODE_ENV: ${nodeEnv}`);
    console.log(`[getTypeOrmConfig - APP] Migrations Run: ${nodeEnv === 'production'}`);
    console.log(`[getTypeOrmConfig - APP] Entities Path: ${entitiesPath.join(', ')}`);
    console.log(`[getTypeOrmConfig - APP] Calculated Migrations Path for App: ${calculatedMigrationsPathForApp}`);
    const dbHost = getEnv('DB_HOST', 'localhost');
    console.log(`[getTypeOrmConfig - APP] DB_HOST: ${dbHost ? dbHost.substring(0, 20) + '...' : 'NOT SET'}`);
  }

  return {
    type: 'postgres',
    host: getEnv('DB_HOST', 'localhost'),
    port: parseInt(getEnv('DB_PORT', '5432'), 10),
    username: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASSWORD', 'postgres'),
    database: getEnv('DB_NAME', 'marketplace'),
    entities: entitiesPath,
    synchronize: nodeEnv !== 'production' && !isCli,
    migrationsRun: nodeEnv === 'production' && !isCli, // Crucial
    migrations: [calculatedMigrationsPathForApp],      // Usar la variable calculada
    migrationsTableName: 'migrations',
    ssl: dbSslRequired === 'true'
      ? { rejectUnauthorized: false }
      : false,
    logging: true, // MANTÉN ESTO EN TRUE PARA RENDER TEMPORALMENTE
  };
};