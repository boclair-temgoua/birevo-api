import { User } from '../../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsInt,
} from 'class-validator';
export type paymentMethodType =
  | 'COUPON-PAY'
  | 'PAYPAL-PAY'
  | 'CARD-PAY'
  | 'USED-VOUCHER'
  | 'VIEW-VOUCHER';

export const paymentMethodArrays = [
  'COUPON-PAY',
  'PAYPAL-PAY',
  'CARD-PAY',
  'USED-VOUCHER',
  'VIEW-VOUCHER',
];

export type CreateOnBullingVoucherRequest = {
  amount: number;
  amountCoupon?: number;
  currency: string;
  paymentMethod?: paymentMethodType;
  userId: number;
  organizationId: number;
  userCreatedId: number;
};

export class CreateStripeBullingDto {
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsNotEmpty()
  infoPaymentMethod: any;

  @IsOptional()
  user: any;
}

export class CreateCouponBullingDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  user: any;
}
