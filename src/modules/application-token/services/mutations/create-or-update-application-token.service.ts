import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { ApplicationToken } from '../../../../models/ApplicationToken';
import { generateUUID } from '../../../../infrastructure/utils/commons/generate-uuid';
import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';
import {
  CreateApplicationTokenOptions,
  UpdateApplicationTokenOptions,
  UpdateApplicationTokenSelections,
} from '../../types/index';

@Injectable()
export class CreateOrUpdateApplicationTokenService {
  constructor(
    @InjectRepository(ApplicationToken)
    private driver: Repository<ApplicationToken>,
  ) {}

  /** Create one ApplicationToken to the database. */
  async createOne(
    options: CreateApplicationTokenOptions,
  ): Promise<ApplicationToken> {
    const { userId, applicationId, organizationId, userCreatedId } = {
      ...options,
    };

    const applicationToken = new ApplicationToken();
    applicationToken.uuid = generateUUID();
    applicationToken.userId = userId;
    applicationToken.organizationId = organizationId;
    applicationToken.userCreatedId = userCreatedId;
    applicationToken.applicationId = applicationId;
    applicationToken.token = generateLongUUID(50);

    const query = this.driver.save(applicationToken);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ApplicationToken to the database. */
  async updateOne(
    selections: UpdateApplicationTokenSelections,
    options: UpdateApplicationTokenOptions,
  ): Promise<ApplicationToken> {
    const { option1 } = { ...selections };
    const { userId, userCreatedId, applicationId, deletedAt } = { ...options };

    let findQuery = this.driver
      .createQueryBuilder('applicationToken')
      .where('applicationToken.deletedAt IS NULL');

    if (option1) {
      const { application_token_uuid } = { ...option1 };
      findQuery = findQuery.andWhere('applicationToken.uuid = :uuid', {
        uuid: application_token_uuid,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.userId = userId;
    findItem.userCreatedId = userCreatedId;
    findItem.applicationId = applicationId;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
