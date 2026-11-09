import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  url: process.env.ATTENDANCE_DB_URL,
  entities: ['apps/attendance-service/src/**/*.entity.ts'],
  migrations: ['apps/attendance-service/src/migrations/*.ts'],
});
