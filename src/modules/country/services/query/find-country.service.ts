import { Injectable, NotFoundException } from '@nestjs/common';
import { Country } from '../../../../models/Country';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetCurrenciesSelections } from '../../types/index';

@Injectable()
export class FindCountryService {
  constructor(
    @InjectRepository(Country)
    private driver: Repository<Country>,
  ) {}

  async findAll(selections: GetCurrenciesSelections): Promise<any> {
    const { filterQuery } = { ...selections };

    let query = this.driver
      .createQueryBuilder('country')
      .select('country.name', 'name')
      .addSelect('country.id', 'id')
      .addSelect('country.code', 'code')
      .where('country.deletedAt IS NULL');

    if (filterQuery?.q) {
      query = query.andWhere('country.name ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
