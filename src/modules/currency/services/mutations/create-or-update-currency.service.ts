import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { Currency } from '../../../../models/Currency';
import {
  CreateCurrencyOptions,
  UpdateCurrencyOptions,
  UpdateCurrencySelections,
} from '../../types/index';

@Injectable()
export class CreateOrUpdateCurrencyService {
  constructor(
    @InjectRepository(Currency)
    private driver: Repository<Currency>,
  ) {}

  /** Create one Currency to the database. */
  async createOne(options: CreateCurrencyOptions): Promise<Currency> {
    const { name, status, code, symbol, amount } = {
      ...options,
    };

    const currency = new Currency();
    currency.name = name;
    currency.status = status;
    currency.code = code;
    currency.symbol = symbol;
    currency.amount = amount;

    const query = this.driver.save(currency);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Currency to the database. */
  async updateOne(
    selections: UpdateCurrencySelections,
    options: UpdateCurrencyOptions,
  ): Promise<Currency> {
    const { option1 } = { ...selections };
    const { name, status, code, symbol, amount, deletedAt } = {
      ...options,
    };

    let findQuery = this.driver.createQueryBuilder('currency');

    if (option1) {
      const { currencyId } = { ...option1 };
      findQuery = findQuery.where('currency.id = :id', {
        id: currencyId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.status = status;
    findItem.code = code;
    findItem.symbol = symbol;
    findItem.amount = amount;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Create multiple Currency to the database. */
  async createMultiple(options: any): Promise<any> {
    // const { currencies } = { ...options };

    const currencies = [];

    const [errors, results] = await useCatch(
      Promise.all(
        currencies.map(async (item) => {
          this.createOne({
            name: item.name,
            code: item.code,
            symbol: item.symbol,
            amount: item.amount,
          });
        }),
      ),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
