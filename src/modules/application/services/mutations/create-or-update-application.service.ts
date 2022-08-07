import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '../../../../models/Application';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import { colorsArrays } from '../../../../infrastructure/utils/commons';
import { getRandomElement } from '../../../../infrastructure/utils/array/get-random-element';
import {
  CreateApplicationOptions,
  UpdateApplicationOptions,
  UpdateApplicationSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateApplicationService {
  constructor(
    @InjectRepository(Application)
    private driver: Repository<Application>,
  ) {}

  /** Create one Application to the database. */
  async createOne(options: CreateApplicationOptions): Promise<Application> {
    const { userId, userCreatedId, name, statusOnline } = { ...options };

    const application = new Application();
    application.uuid = generateUUID();
    application.color = getRandomElement(colorsArrays);
    application.userId = userId;
    application.userCreatedId = userCreatedId;
    application.name = name;
    application.statusOnline = statusOnline;

    const query = this.driver.save(application);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Application to the database. */
  async updateOne(
    selections: UpdateApplicationSelections,
    options: UpdateApplicationOptions,
  ): Promise<Application> {
    const { option1, option2 } = { ...selections };
    const { name, color, statusOnline, deletedAt } = { ...options };

    let findQuery = this.driver.createQueryBuilder('application');

    if (option1) {
      findQuery = findQuery.where('application.uuid = :uuid', {
        uuid: option1.application_uuid,
      });
    }

    if (option2) {
      findQuery = findQuery.where('application.id = :id', {
        id: option2.applicationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.statusOnline = statusOnline;
    findItem.color = color;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
