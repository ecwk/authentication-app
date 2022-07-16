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
  private readonly handleOAuthCallback = async (
    req: Request,
    res: Response
  ) => {
    const user = req.user as User;
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    res.redirect(
      `${this.appConfig.client.oAuthSuccessRedirect}?token=${token}&expiresIn=${expiresIn}`
    );
  };

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user as User;
    const token = await this.authService.getJwtToken(user);
    const expiresIn = new Date(
      Date.now() + ms(this.appConfig.jwt.expiresIn)
    ).getTime();
    return {
      user: user,
      token: {
        encoded: token,
        expiresIn: expiresIn
      }
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google')
  oAuthGoogle() {
    // redirects to callback if authenticated with OAuth
  }
  @UseGuards(GithubAuthGuard)
  @Get('oauth/github')
  oAuthGithub() {
    // redirects to callback if authenticated with OAuth
  }

  @UseGuards(GoogleAuthGuard)
  @Get('oauth/google/callback')
  async oAuthGoogleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  @UseGuards(GithubAuthGuard)
  @Get('oauth/github/callback')
  async oAuthGithubCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }
}
