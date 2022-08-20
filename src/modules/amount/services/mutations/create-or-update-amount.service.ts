import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateAmountOptions } from '../../types/index';
import { Amount } from '../../../../models/Amount';

@Injectable()
export class CreateOrUpdateAmountService {
  constructor(
    @InjectRepository(Amount)
    private driver: Repository<Amount>,
  ) {}

  /** Create one ApplicationToken to the database. */
  async createOne(options: CreateAmountOptions): Promise<Amount> {
    const {
      userId,
      amount,
      currency,
      organizationId,
      userCreatedId,
      paymentMethod,
    } = { ...options };

    const amountSave = new Amount();
    amountSave.amount = amount;
    amountSave.currency = currency;
    amountSave.userId = userId;
    amountSave.paymentMethod = paymentMethod;
    amountSave.organizationId = organizationId;
    amountSave.userCreatedId = userCreatedId;

    const query = this.driver.save(amountSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}
