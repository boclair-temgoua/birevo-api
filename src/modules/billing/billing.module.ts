import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from '../../models/Amount';
import { AmountUsage } from '../../models/AmountUsage';
import { CreateOrUpdateAmountUsageService } from '../amount-usage/services/mutations/create-or-update-amount-usage.service';
import { CreateOrUpdateAmountService } from '../amount/services/mutations/create-or-update-amount.service';
import { CreateContactController } from './controllers/create-bulling.controller';
import { CreateMethodBulling } from './services/user-cases/create-method-bulling';
import { FindOneVoucherByService } from '../voucher/services/query/find-one-voucher-by.service';
import { Voucher } from '../../models/Voucher';
import { GetOneOrMultipleBillingController } from './controllers/get-one-or-multiple-billing.controller';
import { FindAmountService } from '../amount/services/query/find-amount.service';
import { CreateAmountAmountUsage } from './services/user-cases/create-amount-amount-usage';
@Module({
  imports: [TypeOrmModule.forFeature([Amount, Voucher, AmountUsage])],
  controllers: [CreateContactController, GetOneOrMultipleBillingController],
  providers: [
    /** Imports providers mutations */
    CreateOrUpdateAmountUsageService,
    CreateOrUpdateAmountService,
    FindOneVoucherByService,

    /** Imports providers use-cases */
    CreateMethodBulling,
    FindAmountService,
    CreateAmountAmountUsage,
  ],
})
export class BillingModule {}
