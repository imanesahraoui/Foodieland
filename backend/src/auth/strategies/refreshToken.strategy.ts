import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.cookies['refresh_token'];
      },
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return null;
    }
    return { ...payload, refreshToken };
  }
}
