// src/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/* Decorator to mark a route as public, bypassing authentication checks
 This is useful for routes that should be accessible without authentication, such as registration or public APIs
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
 