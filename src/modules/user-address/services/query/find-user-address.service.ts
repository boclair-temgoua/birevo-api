import { Injectable, NotFoundException } from '@nestjs/common';
import { UserAddress } from '../../../../models/UserAddress';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetCurrenciesSelections } from '../../types/index';

@Injectable()
export class FindUserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private driver: Repository<UserAddress>,
  ) {}

  async findAll(selections: GetCurrenciesSelections): Promise<UserAddress[]> {
    const { filterQuery, option1, option2 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('userAddress')
      .select('userAddress.id', 'id')
      .addSelect('userAddress.uuid', 'uuid')
      .addSelect('userAddress.company', 'company')
      .addSelect('userAddress.city', 'city')
      .addSelect('userAddress.phone', 'phone')
      .addSelect('userAddress.region', 'region')
      .addSelect('userAddress.street1', 'street1')
      .addSelect('userAddress.street2', 'street2')
      .addSelect('userAddress.cap', 'cap')
      .addSelect('userAddress.countryId', 'countryId')
      .addSelect('userAddress.userId', 'userId')
      .addSelect('userAddress.organizationId', 'organizationId')
      .addSelect('userAddress.createdAt', 'createdAt')
      .addSelect('userAddress.updatedAt', 'updatedAt')
      .addSelect(
        /*sql*/ `(
      SELECT jsonb_build_object(
            'code', "co"."code",
            'name', "co"."name"
      )
      FROM "country" "co"
      WHERE "userAddress"."countryId" = "co"."id"
      ) AS "country"`,
      )
      .where('userAddress.deletedAt IS NULL');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('userAddress.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.andWhere('userAddress.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (filterQuery) {
      query = query.andWhere('userAddress.userId ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
