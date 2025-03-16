import 'dotenv/config';
import * as joi from 'joi';

interface EnvJwtVars {
        JWT_SECRET_KEY_ACCESS: string,
        JWT_SECRET_KEY_REFRESH: string,
        JWT_ACCESS_TOKEN_EXPIRATION: string,
        JWT_REFRESH_TOKEN_EXPIRATION: string,
        JWT_SECRET_KEY_RESET: string,
        JWT_RESET_TOKEN_EXPIRATION: string
}

export const envsJwtSchema = joi.object({
        JWT_SECRET_KEY_ACCESS: joi.string().required(),
        JWT_SECRET_KEY_REFRESH: joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION: joi.string().required(),
        JWT_SECRET_KEY_RESET: joi.string().required(),
        JWT_RESET_TOKEN_EXPIRATION: joi.string().required()
}).unknown(true);


const {error, value} = envsJwtSchema.validate(process.env);

if (error) throw new Error(`Config Validation Error: ${error.message}`);

const envJwtVars: EnvJwtVars = value;

export const ENVS_JWT = {
    jwt_secret_key_access: envJwtVars.JWT_SECRET_KEY_ACCESS,
    jwt_secret_key_refresh: envJwtVars.JWT_SECRET_KEY_REFRESH,
    jwt_access_token_expiration: envJwtVars.JWT_ACCESS_TOKEN_EXPIRATION,
    jwt_refresh_token_expiration: envJwtVars.JWT_REFRESH_TOKEN_EXPIRATION,
    jwt_secret_key_reset: envJwtVars.JWT_SECRET_KEY_RESET,
    jwt_reset_token_expiration: envJwtVars.JWT_RESET_TOKEN_EXPIRATION,
} 