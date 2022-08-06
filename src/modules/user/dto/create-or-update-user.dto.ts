import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Match } from 'src/infrastructure/utils/commons';
export class CreateOrUpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  password: string;
}

export class TokenResetPasswordUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  token: string;
}

export class UpdateResetPasswordUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}
