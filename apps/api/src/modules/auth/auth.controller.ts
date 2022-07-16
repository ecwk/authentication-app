import * as ms from 'ms';
import { Request, Response } from 'express';
import { Controller, Post, UseGuards, Req, Res, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Public } from './decorators';
import { User } from '../users/schema';
import { LocalAuthGuard } from './passport';
import { AuthService } from './auth.service';
import { AppConfig } from 'src/config/app.config';
import { GoogleAuthGuard, GithubAuthGuard } from './passport';

@Public()
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig>
  ) {}

  private readonly appConfig = this.configService.get('app', { infer: true });

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user as User;
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    return {
      user,
      token: {
        encoded: token,
        expiresIn
      }
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google')
  oAuthGoogle() {
    // This endpoint is used for OAuth authentication
    // If successful, the user will be redirected to the callback
  }

  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google/callback')
  async oAuthGoogleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    res.redirect(
      `${this.appConfig.client.oAuthSuccessRedirect}?token=${token}&expiresIn=${expiresIn}`
    );
  }

  @UseGuards(GithubAuthGuard)
  @Get('oauth/github')
  oAuthGithub() {
    // This endpoint is used for OAuth authentication
    // If successful, the user will be redirected to the callback
  }

  @UseGuards(GithubAuthGuard)
  @Get('oauth/github/callback')
  async oAuthGithubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    res.redirect(
      `${this.appConfig.client.oAuthSuccessRedirect}?token=${token}&expiresIn=${expiresIn}`
    );
  }
}
