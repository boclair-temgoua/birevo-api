import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateAmountBalanceOptions } from '../../types/index';
import { AmountBalance } from '../../../../models/AmountBalance';

@Injectable()
export class CreateOrUpdateAmountBalanceService {
  constructor(
    @InjectRepository(AmountBalance)
    private driver: Repository<AmountBalance>,
  ) {}

  /** Create one AmountBalance to the database. */
  async createOne(options: CreateAmountBalanceOptions): Promise<AmountBalance> {
    const {
      userId,
      amountId,
      organizationId,
      amountBalance,
      monthAmountBalanceAt,
    } = {
      ...options,
    };

    const abbSave = new AmountBalance();
    abbSave.amountId = amountId;
    abbSave.userId = userId;
    abbSave.monthAmountBalanceAt = monthAmountBalanceAt;
    abbSave.organizationId = organizationId;
    abbSave.amountBalance = amountBalance;

    const query = this.driver.save(abbSave);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }
}
