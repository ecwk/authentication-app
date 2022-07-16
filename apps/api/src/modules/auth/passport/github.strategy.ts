import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Strategy, StrategyOptions, Profile } from 'passport-github2';

import { UsersService } from 'src/modules/users/users.service';
import { InjectS3 } from 'src/modules/s3/s3.decorators';
import { User } from 'src/modules/users/schema';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@common/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly usersService: UsersService,
    @InjectS3() private readonly s3Client: S3Client
  ) {
    const github = configService.get('app.oauth.github', {
      infer: true
    });
    const serverUrl = configService.get('app.server.url', {
      infer: true
    });
    super({
      clientID: github.clientId,
      clientSecret: github.clientSecret,
      callbackURL: `${serverUrl}/api/oauth/github/callback`,
      scope: ['user']
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile | any,
    cb: (err: any, user: User | null) => void
  ) {
    const email = profile.emails[0].value;
    const name = (profile?._json?.name as string) ?? undefined;
    const photoUrl = profile?._json?.avatar_url;
    const existingUser = await this.usersService.findOne({
      email
    });
    if (existingUser) {
      return cb(null, existingUser);
    }
    let newUser = await this.usersService.create({
      email: email,
      profile: {
        name: name
      }
    });
    if (photoUrl) {
      const photoFile = await axios.get(photoUrl, {
        responseType: 'arraybuffer'
      });

      const bucket = this.configService.get('app.bucket', {
        infer: true
      });
      const key = `${bucket.directory}/uploads/users/${newUser.id}/profile-picture.png`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket.name,
          Key: key,
          Body: photoFile.data as Buffer,
          ACL: 'public-read'
        })
      );
      const imageUrl = `${bucket.url}/${key}`;
      newUser = await this.usersService.updateProfilePicture(
        { id: newUser.id },
        imageUrl,
        '-_id -__v -password'
      );
    }
    return cb(null, newUser);
  }
}
