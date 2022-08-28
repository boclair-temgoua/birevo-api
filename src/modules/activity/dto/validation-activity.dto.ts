import {
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsIn,
  IsBoolean,
} from 'class-validator';

export type ActionActivity =
  | 'VOUCHER-VIEW'
  | 'VOUCHER-USED'
  | 'VOUCHER-NEW'
  | 'USER-LOGIN'
  | 'USER-REGISTER'
  | 'DELETE';

export const actionActivityArrays = [
  'VOUCHER-VIEW',
  'VOUCHER-USED',
  'VOUCHER-NEW',
  'USER-LOGIN',
  'USER-REGISTER',
  'DELETE',
];

export const getOneActionActivityByNumber = (state: number): ActionActivity => {
  switch (state) {
    case 1:
      return 'VOUCHER-VIEW';
    case 2:
      return 'VOUCHER-USED';
    case 3:
      return 'VOUCHER-NEW';
    case 4:
      return 'USER-LOGIN';
    case 5:
      return 'USER-REGISTER';
    case 5:
      return 'DELETE';
    default:
      return 'VOUCHER-VIEW';
  }
};

export class CreateOrUpdateActivityDto {
  @IsNotEmpty()
  @IsString()
  activityAbleType: string;

  @IsNotEmpty()
  @IsInt()
  activityAbleId: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(actionActivityArrays)
  action: ActionActivity;

  @IsNotEmpty()
  @IsString()
  ipLocation: string;

  @IsNotEmpty()
  @IsString()
  browser?: string;

  @IsNotEmpty()
  @IsString()
  platform?: string;

  @IsNotEmpty()
  @IsInt()
  applicationId: number;

  @IsNotEmpty()
  @IsInt()
  organizationId: number;

  @IsNotEmpty()
  @IsInt()
  userCreatedId?: number;
}

export class GetMultipleActivityDto {
  @IsOptional()
  @IsString()
  voucher_uuid: string;

  @IsOptional()
  @IsString()
  organizationId: string;

  @IsOptional()
  user: any;
}
