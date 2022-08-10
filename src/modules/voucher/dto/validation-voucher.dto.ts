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
export type StatusVoucher = 'PENDING' | 'ACTIVE' | 'USED' | 'TEST';
export type VoucherableType = 'COUPON' | 'VOUCHER' | 'BON';

export const statusVoucherArrays = ['PENDING', 'ACTIVE', 'USED'];

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

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @IsIn(statusVoucherArrays)
  statusVoucher: StatusVoucher;

  @IsOptional()
  user: User;
}

export class ApplicationUuidDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  application_uuid: string;
}
