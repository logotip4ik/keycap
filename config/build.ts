import { destr } from 'destr';

export interface Config {
  // config variables that will be replaced at build time
  oauthEnabled: boolean
  turnstileEnabled: boolean
}

export const config: Config = {
  oauthEnabled: destr(process.env.FEATURE_OAUTH) || false,
  turnstileEnabled: destr(process.env.FEATURE_TURNSTILE) || false,
};

export const prefixedConfig = Object.fromEntries(
  Object.entries(config)
    .map(
      ([k, v]) => [`import.meta.config.${k}`, JSON.stringify(v)],
    ),
);
