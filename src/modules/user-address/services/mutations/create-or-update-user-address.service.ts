import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { UserAddress } from '../../../../models/UserAddress';
import { generateUUID } from '../../../../infrastructure/utils/commons/generate-uuid';
import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';
import {
  CreateUserAddressOptions,
  UpdateUserAddressOptions,
  UpdateUserAddressSelections,
} from '../../types/index';

@Injectable()
export class CreateOrUpdateUserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private driver: Repository<UserAddress>,
  ) {}

  /** Create one UserAddress to the database. */
  async createOne(options: CreateUserAddressOptions): Promise<UserAddress> {
    const {
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
      userId,
      organizationId,
    } = {
      ...options,
    };

    const userAddress = new UserAddress();
    userAddress.uuid = generateUUID();
    userAddress.company = company;
    userAddress.city = city;
    userAddress.phone = phone;
    userAddress.region = region;
    userAddress.street1 = street1;
    userAddress.street2 = street2;
    userAddress.cap = cap;
    userAddress.countryId = countryId;
    userAddress.userId = userId;
    userAddress.organizationId = organizationId;

    const query = this.driver.save(userAddress);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one UserAddress to the database. */
  async updateOne(
    selections: UpdateUserAddressSelections,
    options: UpdateUserAddressOptions,
  ): Promise<UserAddress> {
    const { option1 } = { ...selections };
    const {
      company,
      city,
      phone,
      region,
      street1,
      street2,
      cap,
      countryId,
      userId,
      organizationId,
      deletedAt,
    } = { ...options };

    let findQuery = this.driver.createQueryBuilder('userAddress');

    if (option1) {
      const { user_address_uuid } = { ...option1 };
      findQuery = findQuery.where('userAddress.uuid = :uuid', {
        uuid: user_address_uuid,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.company = company;
    findItem.city = city;
    findItem.phone = phone;
    findItem.region = region;
    findItem.street1 = street1;
    findItem.street2 = street2;
    findItem.cap = cap;
    findItem.countryId = countryId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
