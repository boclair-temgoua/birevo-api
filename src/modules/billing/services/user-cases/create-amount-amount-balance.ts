import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

import { CreateOrUpdateAmountUsageService } from '../../../amount-usage/services/mutations/create-or-update-amount-usage.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import { CreateOnBullingVoucherRequest } from '../../dto/validation-bulling.dto';
import { CreateOrUpdateAmountBalanceService } from '../../../amount-balance/services/mutations/create-or-update-amount-balance.service';

@Injectable()
export class CreateAmountAmountBalance {
  constructor(
    private readonly createOrUpdateAmountBalanceService: CreateOrUpdateAmountBalanceService,
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
  ) {}

  /** Confirm account token to the database. */
  async execute(options: CreateOnBullingVoucherRequest): Promise<any> {
    const {
      amount,
      amountCoupon,
      currency,
      type,
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
        type,
        organizationId,
        userCreatedId,
      }),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    const [errorSaveAmountSub, amountBalSave] = await useCatch(
      this.createOrUpdateAmountBalanceService.createOne({
        amountId: amountSave?.id,
        userId: amountSave?.userId,
        organizationId: amountSave?.organizationId,
        amountBalance: amountCoupon
          ? amountSave?.amount / amountCoupon
          : amountSave?.amount,
      }),
    );
    if (errorSaveAmountSub) {
      throw new NotFoundException(errorSaveAmountSub);
    }

    return amountBalSave;
  }
}
