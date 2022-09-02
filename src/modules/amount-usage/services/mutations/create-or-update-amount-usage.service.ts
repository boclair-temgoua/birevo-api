import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateAmountUsageOptions } from '../../types/index';
import { AmountUsage } from '../../../../models/AmountUsage';

@Injectable()
export class CreateOrUpdateAmountUsageService {
  constructor(
    @InjectRepository(AmountUsage)
    private driver: Repository<AmountUsage>,
  ) {}

  /** Create one ApplicationToken to the database. */
  async createOne(options: CreateAmountUsageOptions): Promise<AmountUsage> {
    const { userId, amountId, organizationId, amountUsage } = {
      ...options,
    };

    const asbSave = new AmountUsage();
    asbSave.amountId = amountId;
    asbSave.userId = userId;
    asbSave.organizationId = organizationId;
    asbSave.amountUsage = amountUsage;

    const query = this.driver.save(asbSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}
