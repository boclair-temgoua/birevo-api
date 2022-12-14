import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsUUID,
  IsInt,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import {
  MatchDate,
  MatchValidationDate,
} from '../../../infrastructure/utils/decorators';
export type StatusOnline = 'ONLINE' | 'OFFLINE' | 'TEST';
export type DeliveryType = 'AMOUNT' | 'PERCENT';
export type StatusVoucher = 'ALL' | 'PENDING' | 'ACTIVE' | 'USED' | 'TEST';
export type VoucherableType = 'COUPON' | 'VOUCHER' | 'BON';

export const deliveryTypeArrays = ['AMOUNT', 'PERCENT'];

export const optionsNumberGenerateCouponArrays = [
  '1',
  '5',
  '10',
  '30',
  '50',
  '100',
  '150',
  '200',
];

export const statusVoucherArrays = ['ALL', 'PENDING', 'ACTIVE', 'USED'];

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
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

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
  @IsString()
  description: string;

  @IsOptional()
  @IsIn(optionsNumberGenerateCouponArrays)
  numberGenerate: number;

  @IsIn(deliveryTypeArrays)
  // @MatchIsEmpty('deliveryType')
  deliveryType: NonNullable<DeliveryType>;

  @IsOptional()
  @IsIn(voucherableTypeArrays)
  type?: NonNullable<VoucherableType>;

  @IsOptional()
  @IsInt()
  voucherId?: number;

  @IsOptional()
  @IsInt()
  // @MatchIsEmpty('currencyId')
  amount: number;

  @IsOptional()
  @IsString()
  // @MatchIsEmpty('amount')
  currencyId?: string;

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
export class StatusVoucherDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['1', '2', '3'])
  status: string;
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

export class CreateDownloadVoucherDto {
  @IsNotEmpty()
  @IsString()
  organizationId: number;

  @IsNotEmpty()
  @IsIn(voucherableTypeArrays)
  type: VoucherableType;

  @IsOptional()
  @IsString()
  @IsIn(statusVoucherArrays)
  statusVoucher: StatusVoucher;

  @IsNotEmpty()
  initiationAt: Date;

  @IsNotEmpty()
  @MatchValidationDate('initiationAt')
  endAt: Date;
}
