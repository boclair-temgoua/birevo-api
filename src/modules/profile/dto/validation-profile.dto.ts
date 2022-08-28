import {
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsUrl,
} from 'class-validator';
export class CreateOrUpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsInt()
  currencyId: number;

  @IsOptional()
  @IsString()
  image: string;
}
