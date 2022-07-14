import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

import {
  S3ModuleOptions,
  S3ModuleAsyncOptions,
  S3ModuleAsyncFactoryOptions
} from './s3.interfaces';
import { getS3ModuleOptionsToken, getS3ConnectionToken } from './s3.utils';

@Global()
@Module({})
export class S3CoreModule {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    const { connectionToken, connectionFactory, ...s3ClientConfig } = options;

    const s3ModuleOptionsProvider: Provider<S3ModuleOptions> = {
      provide: getS3ModuleOptionsToken(connectionToken),
      useValue: options
    };

    const s3ConnectionProvider: Provider<S3Client> = {
      provide: getS3ConnectionToken(connectionToken),
      useFactory: () => {
        const s3ConnectionFactory =
          connectionFactory || ((s3Client) => s3Client);
        const s3Client = new S3Client(s3ClientConfig);
        return s3ConnectionFactory(s3Client);
      }
    };

    return {
      module: S3CoreModule,
      providers: [s3ModuleOptionsProvider, s3ConnectionProvider],
      exports: [s3ConnectionProvider]
    };
  }

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    const { connectionToken, imports, inject, useFactory } = options;

    const s3ModuleOptionsProvider = {
      provide: getS3ModuleOptionsToken(connectionToken),
      useFactory: useFactory,
      inject: inject || []
    };
    const s3ConnectionProvider: Provider<S3Client> = {
      provide: getS3ConnectionToken(connectionToken),
      useFactory: (options: S3ModuleAsyncFactoryOptions) => {
        const { connectionFactory, ...s3ClientConfig } = options;
        const s3ConnectionFactory =
          connectionFactory || ((s3Client) => s3Client);
        const s3Client = new S3Client(s3ClientConfig);
        return s3ConnectionFactory(s3Client);
      },
      inject: [getS3ModuleOptionsToken(connectionToken)]
    };

    return {
      imports: imports,
      module: S3CoreModule,
      providers: [s3ConnectionProvider, s3ModuleOptionsProvider],
      exports: [s3ConnectionProvider]
    };
  }
}
