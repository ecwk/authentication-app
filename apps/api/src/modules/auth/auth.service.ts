import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from 'src/config/app.config';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  private readonly appConfig = this.configService.get('app', { infer: true });

  async login(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      return undefined;
    } else if (!(await user.validatePassword(password))) {
      return undefined;
    } else {
      return this.usersService.findOne({ email }, '-_id -__v -password');
    }
  }

  async getJwtToken(user: User) {
    return this.jwtService.sign(
      { email: user.email },
      {
        subject: user.id,
        expiresIn: this.appConfig.jwt.expiresIn
      }
    );
  }
}
