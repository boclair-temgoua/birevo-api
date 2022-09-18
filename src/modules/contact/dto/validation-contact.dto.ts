import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
export class CreateOrUpdateContactDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsBoolean()
  isRed: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;
}
