import dotenv from 'dotenv';
dotenv.config();

interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

interface Config {
  port: number;
  nodeEnv: string;
  cors: CorsConfig;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true
  }
};

export default config;
