import { Injectable, NotFoundException } from '@nestjs/common';
import { Amount } from '../../../../models/Amount';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetAmountSelections } from '../../types/index';
import { withPagination } from '../../../../infrastructure/utils/pagination/with-pagination';

@Injectable()
export class FindAmountService {
  constructor(
    @InjectRepository(Amount)
    private driver: Repository<Amount>,
  ) {}

  async findAllApplications(
    selections: GetAmountSelections,
  ): Promise<GetAmountSelections> {
    const { pagination, option1, option2 } = { ...selections };

    let query = this.driver.createQueryBuilder('amount');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.where('amount.userId = :userId', { userId });
    }

    if (option2) {
      const { organizationId } = { ...option2 };
      query = query
        .where('amount.paymentMethod IS NOT NULL')
        .andWhere('amount.organizationId = :organizationId', {
          organizationId,
        });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, results] = await useCatch(
      query
        .orderBy(
          'amount.createdAt',
          pagination?.sort ? pagination?.sort : 'DESC',
        )
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);
    return withPagination({
      pagination,
      rowCount,
      data: results,
    });
  }
}
