// typeorm.config.ts

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env (optional)
dotenv.config();

export const AppDataSource = new DataSource({

  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities:
    process.env.NODE_ENV === 'production' 
    ? ['dist/**/*.entity.js'] 
    : [__dirname + '/**/*.entity{.ts,.js}'],

  migrations: ['migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false, // required by Azure Postgres
    ca: process.env.PG_CA ? Buffer.from(process.env.PG_CA, 'base64').toString('ascii') : undefined
  },
  synchronize: false,
  logging: false,
  migrationsRun: true
});
