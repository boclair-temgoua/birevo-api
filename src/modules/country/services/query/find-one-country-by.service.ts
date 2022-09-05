import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneCountrySelections } from '../../types/index';
import { Country } from '../../../../models/Country';

@Injectable()
export class FindOneCountryByService {
  constructor(
    @InjectRepository(Country)
    private driver: Repository<Country>,
  ) {}

  async findOneBy(selections: GetOneCountrySelections): Promise<Country> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('country')
      .where('country.deletedAt IS NULL');

    if (option1) {
      const { countryId } = { ...option1 };
      query = query.where('country.id = :id', { id: countryId });
    }

    if (option2) {
      const { code } = { ...option2 };
      query = query.andWhere('country.code = :code', { code });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
