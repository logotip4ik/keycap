import { destr } from 'destr';

export interface Config {
  oauthEnabled: boolean
  turnstileEnabled: boolean

  benchmarking: boolean

  vercelEnv?: 'production' | 'preview'
}

// config variables that will be replaced at build time
export const config: Config = {
  oauthEnabled: destr(process.env.FEATURE_OAUTH) || false,
  turnstileEnabled: destr(process.env.FEATURE_TURNSTILE) || false,

  benchmarking: destr(process.env.BENCHMARKING) || false,

  vercelEnv: destr(process.env.VERCEL_ENV) || 'production',
};

export const prefixedConfig = Object.fromEntries(
  Object.entries(config)
    .map(
      ([k, v]) => [`import.meta.config.${k}`, JSON.stringify(v)],
    ),
);
