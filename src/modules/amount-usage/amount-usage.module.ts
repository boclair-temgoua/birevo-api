import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountUsage } from '../../models/AmountUsage';
import { FindAmountUsageService } from './services/query/find-amount-usage.service';
import { CreateOrUpdateAmountUsageService } from './services/mutations/create-or-update-amount-usage.service';
import { FindOneAmountUsageByService } from './services/query/find-one-amount-usage-by.service';

@Module({
  imports: [TypeOrmModule.forFeature([AmountUsage])],
  controllers: [],
  providers: [
    FindAmountUsageService,
    CreateOrUpdateAmountUsageService,
    FindOneAmountUsageByService,
  ],
})
export class AmountUsageModule {}
