import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneAmountUsageSelections } from '../../types/index';
import { AmountUsage } from '../../../../models/AmountUsage';

@Injectable()
export class FindOneAmountUsageByService {
  constructor(
    @InjectRepository(AmountUsage)
    private driver: Repository<AmountUsage>,
  ) {}

  async findOneBy(
    selections: GetOneAmountUsageSelections,
  ): Promise<AmountUsage> {
    const { option1 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('amu')
      .select('amu.amountUsage', 'amountUsage')
      .groupBy('amu.organizationId');

    if (option1) {
      const { amountUsageId } = { ...option1 };
      query = query.andWhere('amu.id = :id', {
        id: amountUsageId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('AmountUsage not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
