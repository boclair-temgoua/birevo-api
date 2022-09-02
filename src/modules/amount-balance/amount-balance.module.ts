import { AmountUsage } from '../../models/AmountUsage';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountBalance } from '../../models/AmountBalance';
import { CreateOrUpdateAmountBalanceService } from './services/mutations/create-or-update-amount-balance.service';
import { FindAmountBalanceService } from './services/query/find-amount-balance.service';
import { FindOneAmountBalanceByService } from './services/query/find-one-amount-balance-by.service';
import { CreateAmountAmountBalance } from './services/user-cases/create-amount-amount-balance';
import { FindAmountUsageService } from '../amount-usage/services/query/find-amount-usage.service';
import { CreateOrUpdateAmountService } from '../amount/services/mutations/create-or-update-amount.service';
import { Amount } from '../../models/Amount';

@Module({
  imports: [TypeOrmModule.forFeature([AmountBalance, Amount, AmountUsage])],
  controllers: [],
  providers: [
    FindAmountBalanceService,
    FindAmountUsageService,
    CreateOrUpdateAmountBalanceService,
    FindOneAmountBalanceByService,
    CreateOrUpdateAmountService,

    /** Imports providers use-cases */
    CreateAmountAmountBalance,
  ],
})
export class AmountBalanceModule {}
