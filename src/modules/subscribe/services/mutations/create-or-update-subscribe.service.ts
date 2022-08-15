import { Injectable, NotFoundException } from '@nestjs/common';
import { Subscribe } from '../../../../models/Subscribe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import {
  CreateSubscribeOptions,
  UpdateSubscribeOptions,
  UpdateSubscribeSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateSubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private driver: Repository<Subscribe>,
  ) {}

  /** Create one Subscribe to the database. */
  async createOne(options: CreateSubscribeOptions): Promise<Subscribe> {
    const {
      subscribableType,
      subscribableId,
      organizationId,
      userCreatedId,
      roleId,
      userId,
    } = {
      ...options,
    };

    const subscribe = new Subscribe();
    subscribe.uuid = generateUUID();
    subscribe.subscribableType = subscribableType;
    subscribe.subscribableId = subscribableId;
    subscribe.organizationId = organizationId;
    subscribe.userCreatedId = userCreatedId;
    subscribe.roleId = roleId;
    subscribe.userId = userId;

    const query = this.driver.save(subscribe);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Subscribe to the database. */
  async updateOne(
    selections: UpdateSubscribeSelections,
    options: UpdateSubscribeOptions,
  ): Promise<Subscribe> {
    const { option1, option2 } = { ...selections };
    const { roleId } = { ...options };

    let findQuery = this.driver.createQueryBuilder('subscribe');

    if (option2) {
      const { subscribe_uuid } = { ...option2 };
      findQuery = findQuery.where('subscribe.uuid = :uuid', {
        uuid: subscribe_uuid,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.roleId = roleId;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
