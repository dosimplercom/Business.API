// src/config/cors.config.ts

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = [
  'https://app.dosimpler.com',
  'http://localhost:4200',
  'https://localhost:4200',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true); // Allow non-browser tools
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const regex = /^https:\/\/([a-zA-Z0-9_-]+)\.custom\.dosimpler\.com$/;
    if (regex.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
};
