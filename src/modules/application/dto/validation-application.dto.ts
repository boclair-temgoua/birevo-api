import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsUUID,
} from 'class-validator';
export type StatusOnline = 'ONLINE' | 'OFFLINE' | 'TEST';
export const statusOnlineArrays = ['ONLINE', 'OFFLINE', 'TEST'];

export class CreateOrUpdateApplicationDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  application_uuid: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @IsIn(statusOnlineArrays)
  statusOnline: StatusOnline;

  @IsOptional()
  user: User;
}

export class ApplicationUuidDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  application_uuid: string;
}
