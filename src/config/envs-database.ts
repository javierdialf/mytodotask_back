import 'dotenv/config';
import * as joi from 'joi';


interface EnvDatabaseVars {
    DB_HOST: string,
    DB_PORT: number,
    DATABASE: string,
    DB_USERNAME: string,
    DB_PASSWORD: string,
}

const envsDatabaseSchema = joi.object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DATABASE: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required()
}).unknown(true)


const {error, value} = envsDatabaseSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envDatabaseVars: EnvDatabaseVars = value;

export const ENVS_DATABASE = {
    db_host: envDatabaseVars.DB_HOST,
    db_port: envDatabaseVars.DB_PORT,
    database: envDatabaseVars.DATABASE,
    db_username: envDatabaseVars.DB_USERNAME,
    db_password: envDatabaseVars.DB_PASSWORD,
}