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

  @Public()
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
  async oAuthGoogleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  @Public()
  @UseGuards(GithubAuthGuard)
  @Get('oauth/github/callback')
  async oAuthGithubCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  @Get('whoami')
  async whoami(@Req() req: Request) {
    return { user: req.user };
  }
}
