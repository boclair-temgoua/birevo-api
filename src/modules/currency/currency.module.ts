import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../../models/Currency';
import { CreateOrUpdateCurrencyService } from './services/mutations/create-or-update-currency.service';
import { FindOneCurrencyByService } from './services/query/find-one-currency-by.service';
import { FindCurrencyService } from './services/query/find-currency.service';
import { CreateOrUpdateCurrencyController } from './controllers/create-or-update-currency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [CreateOrUpdateCurrencyController],
  providers: [
    FindCurrencyService,
    CreateOrUpdateCurrencyService,
    FindOneCurrencyByService,
  ],
})
export class CurrencyModule {}
