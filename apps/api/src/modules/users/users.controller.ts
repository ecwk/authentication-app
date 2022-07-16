import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { FileExtension } from 'file-type';
import { ConfigService } from '@nestjs/config';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { AppConfig } from '@common/config/app.config';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { InjectS3 } from '@modules/s3';
// import { Public } from '../auth/decorators';

const PP_ALLOWED_EXTENSIONS: FileExtension[] = ['png', 'jpg'];

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<AppConfig>,
    @InjectS3() private readonly s3Client: S3Client
  ) {}

  @Get()
  async findAll() {
    return this.usersService.findAll('-_id -__v -password');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(
      { id },
      '-_id -__v -password'
    );
    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return foundUser;
  }

  // @Public()
  @Post()
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, '-_id -__v -password');
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const existingEmailUser = await this.usersService.findOne({
      email: updateUserDto.email
    });
    if (existingEmailUser && existingEmailUser.id !== id) {
      throw new BadRequestException(
        `User with email ${updateUserDto.email} already exists`
      );
    }

    const updatedUser = await this.usersService.updateOne(
      { id },
      updateUserDto
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  @Post(':id/upload/profile-picture')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'file',
        maxCount: 1
      }
    ])
  )
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFiles() files: { file?: Express.Multer.File[] }
  ) {
    const user = await this.usersService.findOne({ id });
    const profilePicture = files.file?.[0];
    const fileType =
      profilePicture && (await fileTypeFromBuffer(profilePicture.buffer));
    const fileExtension = fileType?.ext;
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else if (!profilePicture) {
      throw new BadRequestException('No file uploaded');
    } else if (PP_ALLOWED_EXTENSIONS.includes(fileExtension) === false) {
      throw new BadRequestException(
        `Profile picture extension must be [${PP_ALLOWED_EXTENSIONS.join(
          ', '
        )}]`
      );
    }

    const { bucket } = this.configService.get('app', {
      infer: true
    });
    const key = `${bucket.directory}/uploads/users/${id}/profile-picture.png`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket.name,
        Key: key,
        Body: profilePicture.buffer,
        ACL: 'public-read'
      })
    );
    const imageUrl = `${bucket.url}/${key}`;
    const updatedUser = await this.usersService.updateProfilePicture(
      { id },
      imageUrl,
      '-_id -__v -password'
    );
    return updatedUser;
  }

  @Delete(':id/upload/profile-picture')
  async deleteProfilePicture(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id }, '-_id -__v -password');
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { bucket } = this.configService.get('app', {
      infer: true
    });
    if (user.profile?.profilePicture) {
      const profilePictureUrl = new URL(user.profile?.profilePicture || '');
      const key = profilePictureUrl.pathname.substring(1);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket.name,
          Key: key
        })
      );
      const updatedUser = await this.usersService.updateProfilePicture(
        { id },
        undefined,
        '-_id -__v -password'
      );
      return updatedUser;
    }
    return user;
  }
}
