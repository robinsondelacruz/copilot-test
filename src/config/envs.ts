import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  BCRYPT_SALT_ROUNDS: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    BCRYPT_SALT_ROUNDS: joi.number(),
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
};
