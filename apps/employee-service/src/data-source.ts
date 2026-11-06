import 'dotenv/config'
import path from 'path';
import { DataSource } from 'typeorm'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default new DataSource({
    type: 'mysql',
    url: process.env.EMPLOYEE_DB_URL,
    entities: [path.join(__dirname, "**/*.entity.ts")],
    migrations: [path.join(__dirname, "migrations/*.ts")],
})