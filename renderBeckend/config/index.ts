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
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: (() => {
      const raw = process.env.CORS_ORIGIN?.trim();
      if (!raw) return '*';
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    })(),
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
