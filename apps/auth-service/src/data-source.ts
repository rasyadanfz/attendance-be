import 'dotenv/config'
import { DataSource } from 'typeorm'

export default new DataSource({
    type: 'mysql',
    url: process.env.AUTH_DB_URL,
    entities: ["apps/auth-service/src/**/*.entity.ts"],
    migrations: ["apps/auth-service/src/migrations/*.ts"]
})