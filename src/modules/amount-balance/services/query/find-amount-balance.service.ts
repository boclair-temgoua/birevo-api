import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AmountBalance } from '../../../../models/AmountBalance';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetAmountBalanceSelections } from '../../types/index';

@Injectable()
export class FindAmountBalanceService {
  constructor(
    @InjectRepository(AmountBalance)
    private driver: Repository<AmountBalance>,
  ) {}

  async findAll(selections: GetAmountBalanceSelections): Promise<any> {
    const { option1, option2 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('amb')
      .select('amb.organizationId', 'organizationId')
      .addSelect('amb.userId', 'userId')
      .addSelect('amb.count', 'count')
      .addSelect('CAST(SUM("amb"."amountBalance") AS DECIMAL)', 'amountBalance')
      .groupBy('amb.userId')
      .addGroupBy('amb.organizationId');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('amb.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query.andWhere('amb.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errors, results] = await useCatch(query.getRawMany());
    if (errors)
      throw new HttpException('AmountBalance not found', HttpStatus.NOT_FOUND);

    return results;
  }
}
