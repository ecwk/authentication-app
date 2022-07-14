import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<AppConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('app.jwt.secret', {
        infer: true
      }),
      ignoreExpiration: false
    } as StrategyOptions);
  }

  async validate(payload: any): Promise<any> {
    const user = await this.usersService.findOne(
      { id: payload.sub },
      '-password -_id -__v'
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
