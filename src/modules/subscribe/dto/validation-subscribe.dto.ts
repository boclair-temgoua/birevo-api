import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  MaxLength,
  IsEmail,
  IsOptional,
  IsIn,
} from 'class-validator';

export type RoleName = 'ADMIN' | 'MODERATOR';

export const getOneRoleByNumber = (state: number): RoleName => {
  switch (state) {
    case 1:
      return 'ADMIN';
    case 2:
      return 'MODERATOR';
    default:
      return 'ADMIN';
  }
};

export const getOneRoleByName = (state: RoleName): number => {
  switch (state) {
    case 'ADMIN':
      return 1;
    case 'MODERATOR':
      return 2;
    default:
      return 1;
  }
};

export type SubscribableType = 'ORGANIZATION';
export const subscribableTypeArrays = ['ORGANIZATION'];

export class CreateOrUpdateSubscribeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subscribableType: SubscribableType;
}

export class SubscribeRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsIn(subscribableTypeArrays)
  type: SubscribableType;

  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  organizationId: number;

  @IsOptional()
  @IsInt()
  contributorId?: number;
}
