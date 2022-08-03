import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class CreateOrUpdateResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail(100)
  email: string;
}
