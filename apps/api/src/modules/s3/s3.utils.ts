import {
  S3_CONNECTION_NAME,
  S3_MODULE_OPTIONS_NAME,
  S3_DEFAULT_CONNECTION_TOKEN
} from './s3.constants';

export const getS3ModuleOptionsToken = (name?: string) => {
  return `${S3_MODULE_OPTIONS_NAME}-${name || S3_DEFAULT_CONNECTION_TOKEN}`;
};

export const getS3ConnectionToken = (name?: string) => {
  return `${S3_CONNECTION_NAME}-${name || S3_DEFAULT_CONNECTION_TOKEN}`;
};
