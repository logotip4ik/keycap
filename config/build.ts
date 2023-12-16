export interface Config {
  // config variables that will be replaced at build time
}

export const config: Config = {

};

export const prefixedConfig = Object.fromEntries(
  Object.entries(config)
    .map(
      ([k, v]) => [`import.meta.config.${k}`, JSON.stringify(v)],
    ),
);
