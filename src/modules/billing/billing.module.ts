import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from '../../models/Amount';
import { AmountSubscription } from '../../models/AmountSubscription';
import { CreateOrUpdateAmountSubscriptionService } from '../amount-subscription/services/mutations/create-or-update-amount-subscription.service';
import { CreateOrUpdateAmountService } from '../amount/services/mutations/create-or-update-amount.service';
import { CreateAmountAmountSubscription } from './services/user-cases/create-amount-amountSubscription';
@Module({
  imports: [
    TypeOrmModule.forFeature([Amount]),
    TypeOrmModule.forFeature([AmountSubscription]),
  ],
  controllers: [],
  providers: [
    /** Imports providers mutations */
    CreateOrUpdateAmountSubscriptionService,
    CreateOrUpdateAmountService,

    /** Imports providers use-cases */
    CreateAmountAmountSubscription,
  ],
})
export class BillingModule {}
