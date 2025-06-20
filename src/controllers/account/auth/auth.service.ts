import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { getFullName } from 'src/shared/methods';

import { Response } from 'express';
import * as crypto from 'crypto';
import { UserAuth } from 'src/entities/user-auth.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    return salt + '.' + hash.toString('hex');
  }
  async isCorrectPassword(
    inputPassword: string,
    dbPassrord: string,
  ): Promise<boolean> {
    const [salt, storedHash] = dbPassrord.split('.');

    const hash = (await scrypt(inputPassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return false;
    }

    return true;
  }
  generatePreAuthToken(entityId: number): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY');

    if (!secret || !expiresIn) {
      throw new UnprocessableEntityException(
        'Missing Configuration to proceed',
      );
    }

    return jwt.sign({ id: entityId }, secret, { expiresIn });
  }
  generateJWTokens(
    account: UserAuth,
    refresh: boolean,
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const expiresIn = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY');
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRY',
    );

    if (!secret || !expiresIn || !refreshSecret || !refreshExpiresIn) {
      throw new UnprocessableEntityException(
        'Missing Configuration to proceed',
      );
    }

    const data: any = {
      id: account.entity_id,
      full_name: getFullName(
        account.entity.first_name,
        account.entity.last_name,
      ),
      email: account.email,
      refresh: refresh,
    };
    if (account.business_id) {
      data.business_id = account.business_id;
    }

    const accessToken = jwt.sign(data, secret, { expiresIn: expiresIn });
    const refreshToken = jwt.sign(data, refreshSecret, {
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
  addRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Or use `process.env.NODE_ENV === 'production'`
      //sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: true,
      //sameSite: 'None',
      path: '/',
    });
  }
  clearCookies(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      //sameSite: 'None',
    });

    res.clearCookie('XSRF-TOKEN', {
      httpOnly: false,
      secure: true,
      //sameSite: 'None',
      path: '/',
    });
  }
}
