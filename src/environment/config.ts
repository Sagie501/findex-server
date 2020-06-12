const baseConfig: Config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  database: 'mongodb+srv://user:rutikevesh@myspot-t0vxd.mongodb.net/test?retryWrites=true&w=majority'
  // database: 'mongodb://localhost/test'
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
  database: string;
}
