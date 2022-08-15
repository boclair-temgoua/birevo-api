import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Match } from '../../../infrastructure/utils/commons';

export class UpdateInfoUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  organizationInUtilizationId: number;
}

export class TokenUserDto {
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

export class UpdateChangePasswordUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  @Match('newPassword')
  passwordConfirm: string;

  @IsOptional()
  @IsInt()
  userId: number;
}

export class CreateLoginUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  ip: string;
}

export class CreateRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}
