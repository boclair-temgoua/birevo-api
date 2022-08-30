import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsUUID,
  IsEmail,
  IsInt,
  IsPositive,
  IsDateString,
  MinDate,
  IsDate,
  MaxDate,
} from 'class-validator';
import { MatchDate } from '../../../infrastructure/utils/decorators';
export type StatusOnline = 'ONLINE' | 'OFFLINE' | 'TEST';
export type DeliveryType = 'AMOUNT' | 'PERCENT';
export type StatusVoucher = 'PENDING' | 'ACTIVE' | 'USED' | 'TEST';
export type VoucherableType = 'COUPON' | 'VOUCHER' | 'BON';

export const deliveryTypeArrays = ['AMOUNT', 'PERCENT'];

export const statusVoucherArrays = ['PENDING', 'ACTIVE', 'USED'];

export const voucherableTypeArrays = ['COUPON', 'VOUCHER', 'BON'];

export const getOneStatusVoucher = (state: StatusVoucher): number => {
  switch (state) {
    case 'PENDING':
      return 1;
    case 'ACTIVE':
      return 2;
    case 'USED':
      return 3;
    default:
      return 1;
  }
};

export const getOneStatusByNumberVoucher = (state: number): StatusVoucher => {
  switch (state) {
    case 1:
      return 'PENDING';
    case 2:
      return 'ACTIVE';
    case 3:
      return 'USED';
    default:
      return 'PENDING';
  }
};

export const getOneVoucherType = (state: VoucherableType): number => {
  switch (state) {
    case 'COUPON':
      return 1;
    case 'VOUCHER':
      return 2;
    default:
      return 1;
  }
};

export const getOneByNumberVoucherType = (state: number): VoucherableType => {
  switch (state) {
    case 1:
      return 'COUPON';
    case 2:
      return 'VOUCHER';
    case 3:
      return 'BON';
    default:
      return 'COUPON';
  }
};

export class CreateOrUpdateVoucherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  @IsIn(statusVoucherArrays)
  status: StatusVoucher;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsIn(deliveryTypeArrays)
  deliveryType: NonNullable<DeliveryType>;

  @IsOptional()
  @IsIn(voucherableTypeArrays)
  type?: NonNullable<VoucherableType>;

  @IsOptional()
  @IsInt()
  voucherId?: number;

  @IsOptional()
  @IsInt()
  percent?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  applicationId?: number;

  @IsNotEmpty()
  startedAt: Date;

  @IsNotEmpty()
  @MatchDate('startedAt')
  expiredAt: Date;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  user: any;
}

export class GetOneVoucherDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  code: string;

  @IsOptional()
  @IsString()
  @IsIn(voucherableTypeArrays)
  type?: NonNullable<VoucherableType>;

  @IsOptional()
  @IsString()
  @IsUUID()
  voucher_uuid: string;

  @IsOptional()
  @IsInt()
  organizationId: number;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  user: any;
}

export class VoucherableTypeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['1', '2', '3'])
  voucher_type: string;
}
export class CodeVoucherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  code: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  @IsString()
  @IsIn(voucherableTypeArrays)
  type?: NonNullable<VoucherableType>;

  @IsOptional()
  user: any;
}
