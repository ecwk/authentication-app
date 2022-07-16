import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ModuleMetadata, FactoryProvider } from '@nestjs/common';

export interface S3ModuleOptions extends S3ClientConfig {
  connectionToken?: string;
  connectionFactory?: (
    s3Client: S3Client,
    connectionToken?: string
  ) => S3Client;
}

export type S3ModuleAsyncFactoryOptions = Omit<
  S3ModuleOptions,
  'connectionToken'
>;

export interface S3ModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    Pick<FactoryProvider, 'inject'> {
  connectionToken?: string;
  useFactory: (
    ...args: any[]
  ) => Promise<S3ModuleAsyncFactoryOptions> | S3ModuleAsyncFactoryOptions;
}
