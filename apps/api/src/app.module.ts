import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig, { AppConfig } from './config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module, UsersModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      cache: true
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig>) => ({
        uri: configService.get('app.mongo.uri', {
          infer: true
        })
      }),
      inject: [ConfigService]
    }),
    S3Module.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig>) => {
        const bucket = configService.get('app.bucket', { infer: true });
        return {
          endpoint: bucket.endpoint,
          region: bucket.region,
          credentials: {
            accessKeyId: bucket.accessKeyId,
            secretAccessKey: bucket.secretAccessKey
          }
        };
      },
      inject: [ConfigService]
    }),
    UsersModule
    // AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
