import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';

import { CreateOrUpdateAmountSubscriptionService } from '../../../amount-subscription/services/mutations/create-or-update-amount-subscription.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import {
  CreateStripeBullingDto,
  CreateCouponBullingDto,
} from '../../dto/validation-bulling.dto';
import { CreateAmountAmountSubscription } from './create-amount-amountSubscription';
import { configurations } from '../../../../infrastructure/configurations/index';
import Stripe from 'stripe';
import { FindOneVoucherByService } from '../../../voucher/services/query/find-one-voucher-by.service';
import { isEmpty } from '../../../../infrastructure/utils/commons/is-empty';
import {
  getOneVoucherApi,
  useOneVoucherApi,
} from '../../../integrations/birevo/api/index';

const stripe = new Stripe(String(configurations.implementations.stripe.key), {
  apiVersion: '2022-08-01',
});

@Injectable()
export class CreateMethodBulling {
  constructor(
    private readonly findOneVoucherByService: FindOneVoucherByService,
    private readonly createAmountAmountSubscription: CreateAmountAmountSubscription,
  ) {}

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
        amount: amount * 100, // 25
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
        this.createAmountAmountSubscription.execute({
          amount: charge?.amount / 100,
          currency: currency,
          paymentMethod: 'CARD-PAY',
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

  async couponMethod(options: CreateCouponBullingDto): Promise<any> {
    const { code, user } = {
      ...options,
    };

    const [_errorC, coupon] = await useCatch(getOneVoucherApi({ code }));
    if (_errorC) {
      throw new NotFoundException(_errorC);
    }

    if (coupon?.data?.amount !== null) {
      const [__errorC, useCoupon] = await useCatch(
        useOneVoucherApi({ code: coupon?.data?.code }),
      );
      if (__errorC) {
        throw new NotFoundException(__errorC);
      }
      const [_errorBull, bulling] = await useCatch(
        this.createAmountAmountSubscription.execute({
          amount: coupon?.data?.amount,
          currency: coupon?.data?.currency?.code,
          paymentMethod: 'COUPON-PAY',
          userId: user?.organizationInUtilization?.userId,
          organizationId: user?.organizationInUtilizationId,
          userCreatedId: user?.id,
        }),
      );
      if (_errorBull) {
        throw new NotFoundException(_errorBull);
      }
    }

    return coupon?.data;
  }
}
