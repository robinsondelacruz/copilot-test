import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  BCRYPT_SALT_ROUNDS: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    BCRYPT_SALT_ROUNDS: joi.number().default(10),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().default('1h'),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  bcryptSaltRounds: envVars.BCRYPT_SALT_ROUNDS,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
};
