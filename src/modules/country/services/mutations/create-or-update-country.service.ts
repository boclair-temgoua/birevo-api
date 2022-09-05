import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { Country } from '../../../../models/Country';
import {
  CreateCountryOptions,
  UpdateCountryOptions,
  UpdateCountrySelections,
} from '../../types/index';

@Injectable()
export class CreateOrUpdateCountryService {
  constructor(
    @InjectRepository(Country)
    private driver: Repository<Country>,
  ) {}

  /** Create one Country to the database. */
  async createOne(options: CreateCountryOptions): Promise<Country> {
    const { name, code } = { ...options };

    const country = new Country();
    country.name = name;
    country.code = code;

    const query = this.driver.save(country);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Country to the database. */
  async updateOne(
    selections: UpdateCountrySelections,
    options: UpdateCountryOptions,
  ): Promise<Country> {
    const { option1 } = { ...selections };
    const { name, code, deletedAt } = { ...options };

    let findQuery = this.driver.createQueryBuilder('country');

    if (option1) {
      const { countryId } = { ...option1 };
      findQuery = findQuery.where('country.id = :id', { id: countryId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.code = code;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Create multiple Country to the database. */
  async createMultiple(options: any): Promise<any> {
    // const { currencies } = { ...options };

    const currencies = [];

    const [errors, results] = await useCatch(
      Promise.all(
        currencies.map(async (item) => {
          this.createOne({
            name: item.name,
            code: item.code,
          });
        }),
      ),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
