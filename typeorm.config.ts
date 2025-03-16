import { ENVS_DATABASE } from './src/config';
import { DataSource } from "typeorm";


export default new DataSource({
    type: 'mysql',
    host: ENVS_DATABASE.db_host,
    port: ENVS_DATABASE.db_port,

    username: ENVS_DATABASE.db_username,
    password: ENVS_DATABASE.db_password,
    database: ENVS_DATABASE.database,
    entities: ['src/**/*.entity.ts'],
    migrations: ["database/migrations/*.ts"],
})
