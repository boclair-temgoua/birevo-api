import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';

import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import { CreateOnBullingVoucherRequest } from '../../dto/validation-bulling.dto';
import { CreateOrUpdateAmountBalanceService } from '../../../amount-balance/services/mutations/create-or-update-amount-balance.service';
import { CreatePdfAndSendMailAmountAmountBalance } from '../../../amount-balance/services/user-cases/create-pdf-and-send-mail-amount-amount-balance';

@Injectable()
export class CreateAmountAmountBalance {
  constructor(
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
    private readonly createOrUpdateAmountBalanceService: CreateOrUpdateAmountBalanceService,
    private readonly createPdfAndSendMailAmountAmountBalance: CreatePdfAndSendMailAmountAmountBalance,
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
      description,
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
        description,
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

    /** Save to aws PDF */
    // this.createPdfAndSendMailAmountAmountBalance.executeGeneratePDF({
    //   amount: amountSave,
    // });

    return amountSave;
  }
}
