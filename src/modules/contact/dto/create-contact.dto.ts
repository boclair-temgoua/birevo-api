import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
