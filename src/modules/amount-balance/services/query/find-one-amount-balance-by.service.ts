import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneAmountBalanceSelections } from '../../types/index';
import { AmountBalance } from '../../../../models/AmountBalance';

@Injectable()
export class FindOneAmountBalanceByService {
  constructor(
    @InjectRepository(AmountBalance)
    private driver: Repository<AmountBalance>,
  ) {}

  async findOneBy(
    selections: GetOneAmountBalanceSelections,
  ): Promise<AmountBalance> {
    const { option1 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('abl')
      .select('abl.amountBalance', 'amountBalance')
      .groupBy('abl.organizationId');

    if (option1) {
      const { amountBalanceId } = { ...option1 };
      query = query.andWhere('abl.id = :id', {
        id: amountBalanceId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('AmountBalance not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
