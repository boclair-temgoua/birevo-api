import { FindAmountUsageService } from '../../../amount-usage/services/query/find-amount-usage.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateAmountBalanceService } from '../mutations/create-or-update-amount-balance.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import { Cron, Interval } from '@nestjs/schedule';
import { formateDateMountYear } from '../../../../infrastructure/utils/commons/formate-date-dayjs';

@Injectable()
export class CreateAmountAmountBalance {
  constructor(
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
    private readonly findAmountUsageService: FindAmountUsageService,
    private readonly createOrUpdateAmountBalanceService: CreateOrUpdateAmountBalanceService,
  ) {}

  /** Confirm account token to the database. */
  // @Cron('0 0 1 * *') // 31 days
  // @Interval(10000)
  async executeJobSaveBalance(): Promise<any> {
    const [errorSaveAmount, amountUsages] = await useCatch(
      this.findAmountUsageService.findAll({}),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    /** Amount balance */
    console.log('\x1b[33m%s\x1b[0m', '**** Stated Job create balance ****');
    Promise.all([
      amountUsages.map(async (item) => {
        /** Save Amount */
        const [errorSaveAmount, amountSave] = await useCatch(
          this.createOrUpdateAmountService.createOne({
            amount: item?.amountUsage,
            userId: item?.userId,
            currency: 'EUR',
            type: 'BALANCE',
            description: `Balance for ${formateDateMountYear(item?.lastMonth)}`,
            organizationId: item?.organizationId,
          }),
        );
        if (errorSaveAmount) {
          throw new NotFoundException(errorSaveAmount);
        }

        /** Save AmountBalance */
        const [errorSaveAmountBa, amountBalance] = await useCatch(
          this.createOrUpdateAmountBalanceService.createOne({
            amountId: amountSave?.id,
            userId: amountSave?.userId,
            amountBalance: amountSave?.amount,
            monthAmountBalanceAt: item?.lastMonth,
            organizationId: amountSave?.organizationId,
          }),
        );
        if (errorSaveAmountBa) {
          throw new NotFoundException(errorSaveAmountBa);
        }
        console.log(`amountBalance ====>`, amountBalance);
      }),
    ]);
    console.log('\x1b[32m%s\x1b[0m', '**** End Job create balance ****');

    return 'amountSubSave';
  }
}
