// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from '../schemas/user.schema';
//
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(@InjectModel(User.name) private userModel: Model<User>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'secret',
//     });
//   }
//
//   async validate(payload: any) {
//     const { email } = payload;
//     const user = await this.userModel.findOne({ email });
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
//
//   public static extractJwtFromCookie(req: Request) {
//     if (
//       req.cookies &&
//       'user_token' in req.cookies &&
//       req.cookies.user_token.length > 0
//     ) {
//       return req.cookies.user_token;
//     }
//     return null;
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request as RequestType } from 'express';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

export const JwtSecretTMP = 'secretKey';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JwtSecretTMP,
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    return null;
  }

  async validate(payload: any) {
    return { userId: payload.id };
  }
}
