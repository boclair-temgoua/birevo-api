import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsUUID,
  IsInt,
} from 'class-validator';

export class CreateOrUpdateTestimonialDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  testimonial_uuid: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  occupation: string;

  @IsOptional()
  @IsInt()
  rete: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  user: User;
}
