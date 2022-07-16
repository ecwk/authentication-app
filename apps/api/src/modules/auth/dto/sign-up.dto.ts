import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches
} from 'class-validator';

import { IsEmailExist } from '@modules/users/decorators';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsEmailExist()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/, {
    message:
      'password must contain at least 1 uppercase, lowercase, number and special character (!@#$%^&*)'
  })
  password: string;
}
