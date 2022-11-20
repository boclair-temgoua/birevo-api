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
import { CreateOrUpdateUserService } from '../user/services/mutations/create-or-update-user.service';
import { User } from '../../models/User';
import { CreatePdfAndSendMailAmountAmountBalance } from './services/user-cases/create-pdf-and-send-mail-amount-amount-balance';
import { FindOneOrganizationByService } from '../organization/services/query/find-one-organization-by.service';
import { Organization } from '../../models/Organization';
import { CreateOrUpdateOrganizationService } from '../organization/services/mutations/create-or-update-organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AmountBalance,
      Amount,
      AmountUsage,
      User,
      Organization,
    ]),
  ],
  controllers: [],
  providers: [
    FindAmountBalanceService,
    FindAmountUsageService,
    CreateOrUpdateAmountBalanceService,
    FindOneAmountBalanceByService,
    CreateOrUpdateAmountService,
    CreateOrUpdateOrganizationService,

    /** Imports providers use-cases */
    CreateAmountAmountBalance,
    CreateOrUpdateUserService,
    FindOneOrganizationByService,
    CreatePdfAndSendMailAmountAmountBalance,
  ],
})
export class AmountBalanceModule {}
