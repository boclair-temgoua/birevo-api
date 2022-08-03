import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
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
}
