import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsInt,
} from 'class-validator';

export class CreateOrUpdateUserAddressDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  user_address_uuid: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  street1: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  street2: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cap: string;

  @IsOptional()
  @IsInt()
  countryId: number;

  @IsOptional()
  user: User;
}
