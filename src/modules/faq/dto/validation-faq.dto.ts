import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateFaqDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  faq_uuid: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  user: User;
}

export class FaqUuidDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  faq_uuid: string;
}
