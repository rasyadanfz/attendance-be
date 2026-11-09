import 'dotenv/config';
import path from 'path';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default new DataSource({
  type: 'mysql',
  url: process.env.ATTENDANCE_DB_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
