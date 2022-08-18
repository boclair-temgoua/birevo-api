import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneCurrencySelections } from '../../types/index';
import { Currency } from '../../../../models/Currency';

@Injectable()
export class FindOneCurrencyByService {
  constructor(
    @InjectRepository(Currency)
    private driver: Repository<Currency>,
  ) {}

  async findOneBy(selections: GetOneCurrencySelections): Promise<Currency> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('currency')
      .where('currency.deletedAt IS NULL');

    if (option1) {
      const { currencyId } = { ...option1 };
      query = query.where('currency.id = :id', { id: currencyId });
    }

    if (option2) {
      const { code } = { ...option2 };
      query = query.andWhere('currency.code = :code', { code });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Currency not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
