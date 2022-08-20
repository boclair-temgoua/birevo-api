import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from '../../models/Amount';
import { CreateOrUpdateAmountService } from './services/mutations/create-or-update-amount.service';
import { FindOneAmountByService } from './services/query/find-one-amount-by.service';
import { FindAmountService } from './services/query/find-amount.service';

@Module({
  imports: [TypeOrmModule.forFeature([Amount])],
  controllers: [],
  providers: [
    FindAmountService,
    CreateOrUpdateAmountService,
    FindOneAmountByService,
  ],
})
export class AmountModule {}
