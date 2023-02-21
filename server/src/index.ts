import 'dotenv/config';
import { initializeDataSource } from './config/Database';

(async () => {
  await initializeDataSource();
})();
