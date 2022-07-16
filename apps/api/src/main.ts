import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfig } from '@common/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService<AppConfig>);
  const {
    server: { port },
    jwt: { secret: jwtSecret }
  } = configService.get('app', { infer: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // Allow class-validator to use DI
  app.enableCors();
  app.use(cookieParser(jwtSecret));
  app.use(morgan('dev'));

  await app.listen(port);
}
bootstrap();
