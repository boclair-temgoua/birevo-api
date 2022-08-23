import {
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsIn,
} from 'class-validator';

export type ActionActivity =
  | 'VIEW'
  | 'USED'
  | 'NEW'
  | 'LOGIN'
  | 'REGISTER'
  | 'DELETE';

export const actionActivityArrays = [
  'VIEW',
  'USED',
  'NEW',
  'LOGIN',
  'DELETE',
  'REGISTER',
];

export const getOneActionActivityByNumber = (state: number): ActionActivity => {
  switch (state) {
    case 1:
      return 'VIEW';
    case 2:
      return 'USED';
    case 3:
      return 'NEW';
    case 4:
      return 'LOGIN';
    case 5:
      return 'REGISTER';
    case 5:
      return 'DELETE';
    default:
      return 'VIEW';
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
  os?: string;

  @IsNotEmpty()
  @IsString()
  platform?: string;

  @IsNotEmpty()
  @IsString()
  source?: string;

  @IsNotEmpty()
  @IsInt()
  applicationId: number;

  @IsNotEmpty()
  @IsInt()
  userCreatedId?: number;
}
