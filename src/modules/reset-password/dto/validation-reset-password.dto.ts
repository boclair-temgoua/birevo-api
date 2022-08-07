import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
export class CreateOrUpdateResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}
