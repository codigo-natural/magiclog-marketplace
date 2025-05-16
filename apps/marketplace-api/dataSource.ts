import { DataSource, type DataSourceOptions } from 'typeorm';
import { getTypeOrmConfig } from './src/config/typeorm.config';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'; // Importar el tipo específico

process.env.RUNNING_TYPEORM_CLI = 'true';
dotenv.config({ path: join(process.cwd(), '.env') });

const baseDataSourceOptions = getTypeOrmConfig();

const cliDataSourceOptions: DataSourceOptions = {
  ...(baseDataSourceOptions as PostgresConnectionOptions),

  entities: [join(process.cwd(), 'src', '**', '*.entity.ts')],
  migrations: [join(process.cwd(), 'dist', 'db', 'migrations', '*{.js,.ts}')],
};

if (!cliDataSourceOptions.host) {
  console.error(
    "DB_HOST no está definido en cliDataSourceOptions. " +
    "Asegúrate que .env está cargado y configurado correctamente, " +
    "y que getTypeOrmConfig devuelve las opciones de BD."
  );
  process.exit(1);
}

const dataSource = new DataSource(cliDataSourceOptions);
export default dataSource;