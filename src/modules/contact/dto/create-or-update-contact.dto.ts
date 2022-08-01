import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
export class CreateOrUpdateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subject: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
