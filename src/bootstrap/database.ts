import { DataSource } from 'typeorm';
import Card from '../entities/Card';

let initialized = false;
let dataSource = new DataSource({
  type       : 'postgres',
  host       : process.env.POSTGRES_HOST,
  port       : +(process.env.POSTGRES_PORT ?? '5432'),
  username   : process.env.POSTGRES_USER,
  password   : process.env.POSTGRES_PASSWORD,
  database   : process.env.POSTGRES_DB,
  synchronize: true,
  entities   : [Card],
});

export default function configureDatabase (): Promise<void> {
  if (initialized) return Promise.reject();
  initialized = true;
  return dataSource.initialize().then();
}

export function getDataSource (): DataSource {
  return dataSource;
}
