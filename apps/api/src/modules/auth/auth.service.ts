import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService, UserDocument } from '@modules/users';
import { SignUpDto } from './dto/sign-up.dto';
import { AppConfig } from '@common/config';
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

  async getJwtToken(user: Omit<User, 'password'>) {
    return this.jwtService.sign(
      { email: user.email },
      {
        subject: user.id,
        expiresIn: this.appConfig.jwt.expiresIn
      }
    );
  }

  async signUp(signUpDto: SignUpDto, select = ''): Promise<UserDocument> {
    return this.usersService.create(signUpDto, select);
  }
}
