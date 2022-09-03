import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

import {
  CreateStripeBullingDto,
  CreatePayPalBullingDto,
  CreateCouponBullingDto,
} from '../../dto/validation-bulling.dto';
import { configurations } from '../../../../infrastructure/configurations/index';
import Stripe from 'stripe';
import { FindOneVoucherByService } from '../../../voucher/services/query/find-one-voucher-by.service';
import {
  getOneVoucherApi,
  useOneVoucherApi,
} from '../../../integrations/birevo/api/index';
import { CreateAmountAmountBalance } from './create-amount-amount-balance';

const stripe = new Stripe(String(configurations.implementations.stripe.key), {
  apiVersion: '2022-08-01',
});

@Injectable()
export class CreateMethodBulling {
  constructor(
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createAmountAmountBalance: CreateAmountAmountBalance,
  ) {}

  /** Stripe billing */
  async stripeMethod(options: CreateStripeBullingDto): Promise<any> {
    const { amount, currency, fullName, email, infoPaymentMethod, user } = {
      ...options,
    };

    const params: Stripe.CustomerCreateParams = {
      description: `Payment transaction - ${user?.organizationInUtilization?.name}`,
      email: email,
      name: fullName,
    };
    const customer: Stripe.Customer = await stripe.customers.create(params);

    const [error, charge] = await useCatch(
      stripe.paymentIntents.create({
        amount: Number(amount) * 100, // 25
        currency: currency,
        description: customer?.description,
        payment_method: infoPaymentMethod?.id,
        confirm: true,
      }),
    );
    if (error) {
      throw new NotFoundException(error);
    }

    if (charge) {
      const [_errorBull, bulling] = await useCatch(
        this.createAmountAmountBalance.execute({
          amount: Number(charge?.amount) / 100,
          currency: currency,
          type: 'PAYMENT',
          paymentMethod: 'CARD-PAY',
          description: `Cart`,
          userId: user?.organizationInUtilization?.userId,
          organizationId: user?.organizationInUtilizationId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorBull) {
        throw new NotFoundException(_errorBull);
      }
    }

    return charge;
  }

  /** Stripe billing */
  async paypalMethod(options: CreatePayPalBullingDto): Promise<any> {
    const { amount, currency, user } = { ...options };

    const [_errorBull, bulling] = await useCatch(
      this.createAmountAmountBalance.execute({
        amount: Number(amount),
        currency: currency,
        type: 'PAYMENT',
        paymentMethod: 'PAYPAL-PAY',
        description: `PayPal`,
        userId: user?.organizationInUtilization?.userId,
        organizationId: user?.organizationInUtilizationId,
        userCreatedId: user?.id,
      }),
    );
    if (_errorBull) {
      throw new NotFoundException(_errorBull);
    }

    return bulling;
  }

  /** Coupon billing */
  async couponMethod(options: CreateCouponBullingDto): Promise<any> {
    const { code, user } = {
      ...options,
    };

    const [_errorC, coupon] = await useCatch(getOneVoucherApi({ code }));
    if (_errorC) {
      throw new NotFoundException(_errorC);
    }
    if (coupon?.currency === null || coupon?.isExpired) {
      throw new HttpException(
        `Invalid coupon please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    /** Api Use coupon */
    const [__errorC, _useCoupon] = await useCatch(
      useOneVoucherApi({ code: coupon?.code }),
    );
    if (__errorC) {
      throw new NotFoundException(__errorC);
    }
    const [_errorBull, bulling] = await useCatch(
      this.createAmountAmountBalance.execute({
        amount: Number(coupon?.amount),
        type: 'PAYMENT',
        currency: coupon?.currency?.code,
        paymentMethod: 'COUPON-PAY',
        description: `Coupon ${coupon?.organization?.name}`,
        amountCoupon: coupon?.currency?.amount,
        userId: user?.organizationInUtilization?.userId,
        organizationId: user?.organizationInUtilizationId,
        userCreatedId: user?.id,
      }),
    );
    if (_errorBull) {
      throw new NotFoundException(_errorBull);
    }
    return coupon;
  }
}
