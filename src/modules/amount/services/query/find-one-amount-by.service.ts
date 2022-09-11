import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneAmountSelections } from '../../types/index';
import { Amount } from '../../../../models/Amount';

@Injectable()
export class FindOneAmountByService {
  constructor(
    @InjectRepository(Amount)
    private driver: Repository<Amount>,
  ) {}

  async findOneBy(selections: GetOneAmountSelections): Promise<Amount> {
    const { option1, option2 } = { ...selections };
    let query = this.driver.createQueryBuilder('amount');

    if (option1) {
      const { amountId } = { ...option1 };
      query = query.where('amount.id = :id', {
        id: amountId,
      });
    }

    if (option2) {
      const { token, organizationId } = { ...option2 };
      query = query
        .where('amount.token = :token', { token })
        .andWhere('amount.organizationId = :organizationId', {
          organizationId,
        });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Amount not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
