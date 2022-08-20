import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateAmountSubscriptionOptions } from '../../types/index';
import { AmountSubscription } from '../../../../models/AmountSubscription';

@Injectable()
export class CreateOrUpdateAmountSubscriptionService {
  constructor(
    @InjectRepository(AmountSubscription)
    private driver: Repository<AmountSubscription>,
  ) {}

  /** Create one ApplicationToken to the database. */
  async createOne(
    options: CreateAmountSubscriptionOptions,
  ): Promise<AmountSubscription> {
    const { userId, amountId, organizationId, amountSubscription } = {
      ...options,
    };

    const asbSave = new AmountSubscription();
    asbSave.amountId = amountId;
    asbSave.userId = userId;
    asbSave.organizationId = organizationId;
    asbSave.amountSubscription = amountSubscription;

    const query = this.driver.save(asbSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}
