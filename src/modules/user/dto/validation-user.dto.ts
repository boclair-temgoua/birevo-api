import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Match } from '../../../infrastructure/utils/decorators';
export class UpdateInfoUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsInt()
  organizationInUtilizationId?: number;

  @IsNotEmpty()
  @IsInt()
  organizationId: number;

  @IsOptional()
  user: any;
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

export class UpdateEmailUserDto {
  @IsNotEmpty()
  @MaxLength(200)
  @IsEmail()
  @IsString()
  newEmail: string;

  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(8)
  passwordConfirm: string;

  @IsOptional()
  user: any;
}
export class UpdateChangePasswordUserDto {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MaxLength(100)
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MaxLength(100)
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
  ipLocation: string;
}

export class CreateRegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsOptional()
  @IsString()
  codeVoucher: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}
