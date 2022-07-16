import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { appConfig, AppConfig } from '@common/config';
import { AppController } from './app.controller';
import { UsersModule } from '@modules/users';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth';
import { S3Module } from '@modules/s3';

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
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
