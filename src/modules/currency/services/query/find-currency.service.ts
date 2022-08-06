import { Injectable, NotFoundException } from '@nestjs/common';
import { Currency } from '../../../../models/Currency';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetCurrenciesSelections } from '../../types/index';

@Injectable()
export class FindCurrencyService {
  constructor(
    @InjectRepository(Currency)
    private driver: Repository<Currency>,
  ) {}

  async findAllCurrencies(
    selections: GetCurrenciesSelections,
  ): Promise<GetCurrenciesSelections[]> {
    const { filterQuery } = { ...selections };

    let query = this.driver
      .createQueryBuilder('currency')
      .select('currency.name', 'name')
      .addSelect('currency.id', 'id')
      .addSelect('currency.code', 'code')
      .addSelect('currency.symbol', 'symbol')
      .addSelect('currency.amount', 'amount')
      .where('currency.deletedAt IS NULL');

    if (filterQuery) {
      query = query.andWhere('currency.name ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
