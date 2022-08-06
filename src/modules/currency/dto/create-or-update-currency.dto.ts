import {
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
export class CreateOrUpdateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  symbol: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  image: string;
}
