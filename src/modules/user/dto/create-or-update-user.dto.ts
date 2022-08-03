import { IsString, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';
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
