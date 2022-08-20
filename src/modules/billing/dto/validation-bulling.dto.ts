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
export type paymentMethodType = 'COUPON-PAY' | 'PAYPAL-PAY' | 'CARD-PAY';

export const paymentMethodArrays = ['COUPON-PAY', 'PAYPAL-PAY', 'CARD-PAY'];

export type CreateOnBullingVoucherRequest = {
  amount: number;
  amountCoupon?: number;
  currency: string;
  paymentMethod?: paymentMethodType;
  userId: number;
  organizationId: number;
  userCreatedId: number;
};
