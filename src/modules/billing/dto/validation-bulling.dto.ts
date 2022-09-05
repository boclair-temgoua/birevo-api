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
  | 'USED-COUPON'
  | 'VIEW-VOUCHER';

export const paymentMethodArrays = [
  'COUPON-PAY',
  'PAYPAL-PAY',
  'CARD-PAY',
  'USED-VOUCHER',
  'USED-COUPON',
  'VIEW-VOUCHER',
];

export type CreateOnBullingVoucherRequest = {
  amount: number;
  amountCoupon?: number;
  currency: string;
  type?: 'PAYMENT' | 'BALANCE';
  paymentMethod?: paymentMethodType;
  userId: number;
  description: string;
  organizationId: number;
  userCreatedId: number;
};

export type CreateBullingCouponMethodRequest = {
  coupon: any;
  ipLocation: string;
  userAgent: string;
  user: any;
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
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  user: any;
}

export class CreatePayPalBullingDto {
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  user: any;
}
export class CreateCouponBullingDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  ipLocation: string;

  @IsOptional()
  user: any;
}
