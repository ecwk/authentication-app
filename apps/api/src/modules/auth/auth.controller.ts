import * as ms from 'ms';
import { Request, Response } from 'express';
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
  Body,
  HttpCode
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleAuthGuard, GithubAuthGuard } from './passport';
import { SignUpDto } from './dto/sign-up.dto';
import { ReqUser } from '@common/decorators';
import { AuthService } from './auth.service';
import { RequestUser } from '@common/types';
import { LocalAuthGuard } from './passport';
import { AppConfig } from '@common/config';
import { Public } from './decorators';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  private readonly appConfig = this.configService.get('app', { infer: true });
  private readonly handleOAuthCallback = async (
    user: RequestUser,
    res: Response
  ) => {
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    res.redirect(
      `${this.appConfig.client.oAuthSuccessRedirect}?token=${token}&expiresIn=${expiresIn}`
    );
  };

  @Public()
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(
      signUpDto,
      '-_id -__v -password'
    );
    return { user: user };
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqUser() reqUser: RequestUser) {
    const token = await this.authService.getJwtToken(reqUser);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    return {
      user: reqUser,
      token: {
        encoded: token,
        expiresIn: expiresIn
      }
    };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google')
  oAuthGoogle() {
    // redirects to callback if authenticated with OAuth
  }

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('oauth/github')
  oAuthGithub() {
    // redirects to callback if authenticated with OAuth
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google/callback')
  async oAuthGoogleCallback(@ReqUser() reqUser: RequestUser, @Res() res: Response) {
    return this.handleOAuthCallback(reqUser, res);
  }

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('oauth/github/callback')
  async oAuthGithubCallback(@ReqUser() reqUser: RequestUser, @Res() res: Response) {
    return this.handleOAuthCallback(reqUser, res);
  }

  @Get('whoami')
  async whoami(@ReqUser() reqUser: RequestUser) {
    return { user: reqUser };
  }
}
