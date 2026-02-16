import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Admin } from '../schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

type JwtPayload = {
  email: string;
  sub: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    const admin = await this.adminModel.findOne({ email: payload.email });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return { 
        sub: payload.sub, 
        email: payload.email,
        fullName: admin.fullName,          
        profilePicture: admin.profilePicture 
    };
  }
}
