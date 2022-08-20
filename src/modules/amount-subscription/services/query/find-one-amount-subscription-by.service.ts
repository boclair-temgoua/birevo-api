import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneAmountSubscriptionSelections } from '../../types/index';
import { AmountSubscription } from '../../../../models/AmountSubscription';

@Injectable()
export class FindOneAmountSubscriptionByService {
  constructor(
    @InjectRepository(AmountSubscription)
    private driver: Repository<AmountSubscription>,
  ) {}

  async findOneBy(
    selections: GetOneAmountSubscriptionSelections,
  ): Promise<AmountSubscription> {
    const { option1 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('asb')
      .select('asb.amountSubscription', 'amountSubscription')
      .groupBy('asb.organizationId');

    if (option1) {
      const { amountSubscriptionId } = { ...option1 };
      query = query.andWhere('asb.id = :id', {
        id: amountSubscriptionId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException(
        'AmountSubscription not found',
        HttpStatus.NOT_FOUND,
      );

    return result;
  }
}
