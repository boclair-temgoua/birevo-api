import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export type SubscribableType = 'ORGANIZATION';
export const subscribableTypeArrays = ['ORGANIZATION'];

export class CreateOrUpdateSubscribeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subscribableType: SubscribableType;
}
