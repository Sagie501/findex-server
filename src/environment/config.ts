const baseConfig: Config = {
  port: parseInt(process.env.PORT, 10) || 6060
};

export const config: EnvironmentConfig = {
  dev: {
    ...baseConfig
  },
  prod: {
    ...baseConfig
  }
};

export interface EnvironmentConfig {
  dev: Config;
  prod: Config;
}

export interface Config {
  port: number;
}
