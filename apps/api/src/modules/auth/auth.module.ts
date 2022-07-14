import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AppConfig } from 'src/config/app.config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalStrategy } from './passport';
import { JwtStrategy } from './passport';
import { GoogleStrategy, GithubStrategy } from './passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AppConfig>) => {
        const appConfig = configService.get('app', { infer: true });
        return {
          secret: appConfig.jwt.secret,
          signOptions: {
            expiresIn: appConfig.jwt.expiresIn
          }
        };
      },
      inject: [ConfigService]
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    GoogleStrategy,
    GithubStrategy
  ]
})
export class AuthModule {}
