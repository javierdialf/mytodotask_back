import 'dotenv/config';
import * as joi from 'joi';

interface EnvNodemailerVars {
        NODEMAILER_HOST: string,
        NODEMAILER_PORT: number,
        NODEMAILER_MAIL_USER: string,
        NODEMAILER_MAIL_PASSWORD: string
}

export const envsNodemailerSchema = joi.object({
    NODEMAILER_MAIL_USER: joi.string().required(),
    NODEMAILER_MAIL_PASSWORD: joi.string().required(),
    NODEMAILER_HOST: joi.string().required(),
    NODEMAILER_PORT: joi.number().required(),
}).unknown(true);

const {error, value} = envsNodemailerSchema.validate(process.env);

if (error) throw new Error(`Config Validation Error: ${error.message}`);

const envNodemailerVars: EnvNodemailerVars = value;

export const ENVS_NODEMAILER = {
    nodemailer_host: envNodemailerVars.NODEMAILER_HOST,
    nodemailer_port: envNodemailerVars.NODEMAILER_PORT,
    nodemailer_mail_user: envNodemailerVars.NODEMAILER_MAIL_USER,
    nodemailer_mail_password: envNodemailerVars.NODEMAILER_MAIL_PASSWORD
} 