import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import { User } from '../../../../models/User';
import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';
import {
  CreateUserOptions,
  UpdateUserOptions,
  UpdateUserSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateUserService {
  constructor(
    @InjectRepository(User)
    private driver: Repository<User>,
  ) {}

  /** Create one profile to the database. */
  async createOne(options: CreateUserOptions): Promise<User> {
    const {
      email,
      username,
      password,
      noHashPassword,
      profileId,
      organizationInUtilizationId,
    } = {
      ...options,
    };

    const user = new User();
    user.uuid = generateUUID();
    user.token = generateLongUUID(50);
    user.email = email;
    user.hashPassword(password);
    user.username = username;
    user.noHashPassword = noHashPassword;
    user.profileId = profileId;
    user.organizationInUtilizationId = organizationInUtilizationId;

    const query = this.driver.save(user);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one profile to the database. */
  async updateOne(
    selections: UpdateUserSelections,
    options: UpdateUserOptions,
  ): Promise<User> {
    const { option1, option2, option4 } = { ...selections };
    const {
      email,
      username,
      password,
      noHashPassword,
      accessToken,
      refreshToken,
      organizationInUtilizationId,
      deletedAt,
      confirmedAt,
    } = {
      ...options,
    };
    let findQuery = this.driver.createQueryBuilder('user');

    if (option1) {
      const { userId } = { ...option1 };
      findQuery = findQuery.andWhere('user.id = :id', {
        id: userId,
      });
    }

    if (option2) {
      const { email } = { ...option2 };
      findQuery = findQuery.andWhere('user.email = :email', { email });
    }

    if (option4) {
      const { user_uuid } = { ...option4 };
      findQuery = findQuery.andWhere('user.uuid = :uuid', { uuid: user_uuid });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.email = email;
    findItem.username = username;
    if (password) {
      findItem.hashPassword(password);
    }
    findItem.noHashPassword = noHashPassword;
    findItem.accessToken = accessToken;
    findItem.refreshToken = refreshToken;
    findItem.organizationInUtilizationId = organizationInUtilizationId;
    findItem.deletedAt = deletedAt;
    findItem.confirmedAt = confirmedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
