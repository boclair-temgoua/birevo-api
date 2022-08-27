import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { Profile } from '../../../../models/Profile';
import { colorsArrays } from '../../../../infrastructure/utils/commons';
import { getRandomElement } from '../../../../infrastructure/utils/array/get-random-element';
import {
  CreateProfileOptions,
  UpdateProfileOptions,
  UpdateProfileSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateProfileService {
  constructor(
    @InjectRepository(Profile)
    private driver: Repository<Profile>,
  ) {}

  /** Create one profile to the database. */
  async createOne(options: CreateProfileOptions): Promise<Profile> {
    const { firstName, currencyId, lastName, image, url } = {
      ...options,
    };

    const profile = new Profile();
    profile.image = image;
    profile.lastName = lastName;
    profile.color = getRandomElement(colorsArrays);
    profile.currencyId = currencyId;
    profile.firstName = firstName;
    profile.url = url;

    const query = this.driver.save(profile);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one profile to the database. */
  async updateOne(
    selections: UpdateProfileSelections,
    options: UpdateProfileOptions,
  ): Promise<Profile> {
    const { option1 } = { ...selections };
    const { firstName, currencyId, lastName, url, image, deletedAt } = {
      ...options,
    };

    let findQuery = this.driver.createQueryBuilder('profile');

    if (option1) {
      const { profileId } = { ...option1 };
      findQuery = findQuery.where('profile.id = :id', {
        id: profileId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.image = image;
    findItem.url = url;
    findItem.lastName = lastName;
    findItem.firstName = firstName;
    findItem.currencyId = currencyId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
