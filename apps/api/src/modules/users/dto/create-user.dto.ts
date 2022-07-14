import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateProfileDto } from './create-profile.dto';
import { IsEmailExist } from '../decorators';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsEmailExist()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/, {
    message:
      'password must contain at least 1 uppercase, lowercase, number and special character (!@#$%^&*)'
  })
  password?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;
}
