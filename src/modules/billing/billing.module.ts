import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from '../../models/Amount';
import { AmountSubscription } from '../../models/AmountSubscription';
import { CreateOrUpdateAmountSubscriptionService } from '../amount-subscription/services/mutations/create-or-update-amount-subscription.service';
import { CreateOrUpdateAmountService } from '../amount/services/mutations/create-or-update-amount.service';
import { CreateAmountAmountSubscription } from './services/user-cases/create-amount-amountSubscription';
import { CreateContactController } from './controllers/create-bulling.controller';
import { CreateMethodBulling } from './services/user-cases/create-method-bulling';
import { FindOneVoucherByService } from '../voucher/services/query/find-one-voucher-by.service';
import { Voucher } from '../../models/Voucher';
import { GetOneOrMultipleBillingController } from './controllers/get-one-or-multiple-billing.controller';
import { FindAmountService } from '../amount/services/query/find-amount.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Amount]),
    TypeOrmModule.forFeature([Voucher]),
    TypeOrmModule.forFeature([AmountSubscription]),
  ],
  controllers: [CreateContactController, GetOneOrMultipleBillingController],
  providers: [
    /** Imports providers mutations */
    CreateOrUpdateAmountSubscriptionService,
    CreateOrUpdateAmountService,
    FindOneVoucherByService,

    /** Imports providers use-cases */
    CreateMethodBulling,
    FindAmountService,
    CreateAmountAmountSubscription,
  ],
})
export class BillingModule {}
