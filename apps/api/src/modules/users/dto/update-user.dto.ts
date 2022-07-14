import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  MinLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateProfileDto } from './create-profile.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/, {
    message:
      'password must contain at least 1 uppercase, lowercase, number and special character (!@#$%^&*)'
  })
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}
