import { DataSource } from 'typeorm';
import Card from '../entities/Card';

const dataSource = new DataSource({
  type       : 'postgres',
  host       : '127.0.0.1',
  port       : 5432,
  database   : process.env.POSTGRES_DB,
  username   : process.env.POSTGRES_USER,
  password   : process.env.POSTGRES_PASSWORD,
  entities   : [
    Card,
  ],
  synchronize: true,
});
let isInitialized = false;

export async function initializeDataSource (): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;
  return dataSource.initialize().then();
}

export function getDataSource (): DataSource {
  return dataSource;
}


