import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountSubscription } from '../../models/AmountSubscription';
import { FindAmountSubscriptionService } from './services/query/find-amount-subscription.service';
import { CreateOrUpdateAmountSubscriptionService } from './services/mutations/create-or-update-amount-subscription.service';
import { FindOneAmountSubscriptionByService } from './services/query/find-one-amount-subscription-by.service';

@Module({
  imports: [TypeOrmModule.forFeature([AmountSubscription])],
  controllers: [],
  providers: [
    FindAmountSubscriptionService,
    CreateOrUpdateAmountSubscriptionService,
    FindOneAmountSubscriptionByService,
  ],
})
export class AmountSubscriptionModule {}
