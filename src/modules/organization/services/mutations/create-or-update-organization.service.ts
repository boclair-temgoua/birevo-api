import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { Organization } from '../../../../models/Organization';
import { colorsArrays } from '../../../../infrastructure/utils/commons/get-colors';
import { getRandomElement } from '../../../../infrastructure/utils/array/get-random-element';
import { generateUUID } from '../../../../infrastructure/utils/commons/generate-uuid';
import {
  CreateOrganizationOptions,
  UpdateOrganizationOptions,
  UpdateOrganizationSelections,
} from '../../types/index';

@Injectable()
export class CreateOrUpdateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  /** Create one Organization to the database. */
  async createOne(options: CreateOrganizationOptions): Promise<Organization> {
    const { userId, name } = { ...options };

    const organization = new Organization();
    organization.uuid = generateUUID();
    organization.userId = userId;
    organization.name = name;
    organization.color = getRandomElement(colorsArrays);

    const query = this.driver.save(organization);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Organization to the database. */
  async updateOne(
    selections: UpdateOrganizationSelections,
    options: UpdateOrganizationOptions,
  ): Promise<Organization> {
    const { option1 } = { ...selections };
    const { userId, name, deletedAt } = {
      ...options,
    };

    let findQuery = this.driver.createQueryBuilder('organization');

    if (option1) {
      const { organizationId } = { ...option1 };
      findQuery = findQuery.where('organization.id = :id', {
        id: organizationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.userId = userId;
    findItem.name = name;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
