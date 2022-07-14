import { registerAs } from '@nestjs/config';

interface Configuration {
  server: {
    port: number;
    url: string;
  };
  client: {
    url: string;
    oAuthSuccessRedirect: string;
    oAuthFailureRedirect: string;
  };
  mongo: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  bucket: {
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    name: string;
    directory: string;
    url: string;
  };
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
    github: {
      clientId: string;
      clientSecret: string;
    };
  };
}

export interface AppConfig {
  app: Configuration;
}

export default registerAs(
  'app',
  (): Configuration => ({
    server: {
      port: Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 8000,
      url: process.env.SERVER_URL || 'http://localhost:8000'
    },
    client: {
      url: process.env.CLIENT_URL || 'http://localhost:3000',
      oAuthSuccessRedirect: `${process.env.CLIENT_URL}/oauth/success`,
      oAuthFailureRedirect: `${process.env.CLIENT_URL}/oauth/failure`
    },
    mongo: {
      uri:
        process.env.MONGO_URI || 'mongodb://localhost:27017/authentication-app'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    bucket: {
      endpoint: process.env.BUCKET_ENDPOINT,
      region: process.env.BUCKET_REGION,
      accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
      name: process.env.BUCKET_NAME,
      directory: process.env.BUCKET_DIRECTORY?.endsWith('/')
        ? process.env.BUCKET_DIRECTORY?.slice(0, -1)
        : process.env.BUCKET_DIRECTORY,
      url: process.env.BUCKET_URL?.endsWith('/')
        ? process.env.BUCKET_URL?.slice(0, -1)
        : process.env.BUCKET_URL
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }
    }
  })
);
