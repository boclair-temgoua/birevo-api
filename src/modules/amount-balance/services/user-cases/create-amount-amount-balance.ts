import { FindAmountUsageService } from '../../../amount-usage/services/query/find-amount-usage.service';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOnAmountBalanceDto } from '../../dto/validation-amount-balance.dto';
import { Cron, Interval } from '@nestjs/schedule';
import { CreateOrUpdateAmountBalanceService } from '../mutations/create-or-update-amount-balance.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';

@Injectable()
export class CreateAmountAmountBalance {
  constructor(
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
    private readonly findAmountUsageService: FindAmountUsageService,
    private readonly createOrUpdateAmountBalanceService: CreateOrUpdateAmountBalanceService,
  ) {}

  /** Confirm account token to the database. */
  // @Cron('1 * * * * *')
  // @Interval(10000)
  async execute(options: CreateOnAmountBalanceDto): Promise<any> {
    const [errorSaveAmount, amountUsages] = await useCatch(
      this.findAmountUsageService.findAll({}),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    /** Amount balance */
    Promise.all([
      amountUsages.map(async (item) => {
        /** Save Amount */
        const [errorSaveAmount, amount] = await useCatch(
          this.createOrUpdateAmountService.createOne({
            amount: item?.amountUsage,
            userId: item?.userId,
            currency: 'EUR',
            type: 'BALANCE',
            organizationId: item?.organizationId,
          }),
        );
        if (errorSaveAmount) {
          throw new NotFoundException(errorSaveAmount);
        }

        /** Save AmountBalance */
        const [errorSaveAmountBa, amountBalSave] = await useCatch(
          this.createOrUpdateAmountBalanceService.createOne({
            amountId: amount?.id,
            userId: item?.userId,
            amountBalance: item?.amountUsage,
            monthAmountBalanceAt: item?.currentMonth,
            organizationId: item?.organizationId,
          }),
        );
        if (errorSaveAmountBa) {
          throw new NotFoundException(errorSaveAmountBa);
        }
      }),
    ]);

    console.log(`amountUsages ====>`, amountUsages);

    return 'amountSubSave';
  }
}
