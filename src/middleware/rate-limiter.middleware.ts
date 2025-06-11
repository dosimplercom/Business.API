// src/middleware/rate-limiter.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10,
    handler: (req, res: any) => {
      console.error(
        `Rate Limiter Middleware. Too many requests: ${req.method} ${req.originalUrl} from IP: ${req.ip}`,
      );
      res.status(429).json({ message: 'Too many requests' });
    },
    standardHeaders: false, // Disable standard headers like RateLimit-Limit, RateLimit-Remaining, etc.
    legacyHeaders: false,
  });

  use(req: any, res: any, next: () => void) {
    this.limiter(req, res, next);
  }
}
