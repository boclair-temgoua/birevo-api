import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from 'src/infrastructure/utils/use-catch';

import { CreateOrUpdateAmountSubscriptionService } from '../../../amount-subscription/services/mutations/create-or-update-amount-subscription.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import { CreateOnBullingVoucherRequest } from '../../dto/validation-bulling.dto';

@Injectable()
export class CreateAmountAmountSubscription {
  constructor(
    private readonly createOrUpdateAmountSubscriptionService: CreateOrUpdateAmountSubscriptionService,
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
  ) {}

  /** Confirm account token to the database. */
  async execute(options: CreateOnBullingVoucherRequest): Promise<any> {
    const {
      amount,
      amountCoupon,
      currency,
      paymentMethod,
      userId,
      organizationId,
      userCreatedId,
    } = {
      ...options,
    };

    const [errorSaveAmount, amountSave] = await useCatch(
      this.createOrUpdateAmountService.createOne({
        amount,
        currency,
        paymentMethod,
        userId,
        organizationId,
        userCreatedId,
      }),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    const [errorSaveAmountSub, amountSubSave] = await useCatch(
      this.createOrUpdateAmountSubscriptionService.createOne({
        amountId: amountSave?.id,
        userId: amountSave?.userId,
        organizationId: amountSave?.organizationId,
        amountSubscription: amountCoupon
          ? amountSave?.amount / amountCoupon
          : amountSave?.amount,
      }),
    );
    if (errorSaveAmountSub) {
      throw new NotFoundException(errorSaveAmountSub);
    }

    return amountSubSave;
  }
}
