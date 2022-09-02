import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AmountUsage } from '../../../../models/AmountUsage';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetAmountUsageSelections } from '../../types/index';

@Injectable()
export class FindAmountUsageService {
  constructor(
    @InjectRepository(AmountUsage)
    private driver: Repository<AmountUsage>,
  ) {}

  async findAll(selections: GetAmountUsageSelections): Promise<any> {
    const { option1, option2 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('amu')
      .select('amu.organizationId', 'organizationId')
      .addSelect('amu.userId', 'userId')
      .addSelect('amu.count', 'count')
      .addSelect("DATE_TRUNC('month', amu.createdAt)", 'lastMonth')
      .addSelect('CAST(SUM("amu"."amountUsage") AS DECIMAL)', 'amountUsage')
      .where(
        "amu.createdAt BETWEEN DATE_TRUNC('month', NOW()) - INTERVAL '1 month' AND DATE_TRUNC('month', NOW())",
      )
      .leftJoin('amu.amount', 'amount')
      .groupBy('amu.userId')
      .addGroupBy('amu.organizationId')
      .addGroupBy('amount.userId')
      .addGroupBy("DATE_TRUNC('month', amu.createdAt)");

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('amu.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.andWhere('amu.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors)
      throw new HttpException('AmountUsage not found', HttpStatus.NOT_FOUND);

    return results;
  }
}
