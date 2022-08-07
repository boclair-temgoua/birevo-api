import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '../../../../models/Application';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetApplicationsSelections } from '../../types';

@Injectable()
export class FindApplicationService {
  constructor(
    @InjectRepository(Application)
    private driver: Repository<Application>,
  ) {}

  async findAllApplications(
    selections: GetApplicationsSelections,
  ): Promise<GetApplicationsSelections> {
    const { filterQuery, pagination, option1 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.applicationTokens', 'applicationTokens')
      .where('application.deletedAt IS NULL');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('application.userId = :userId', { userId });
    }

    if (filterQuery?.q) {
      query = query.andWhere('application.name ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, results] = await useCatch(
      query
        .orderBy('application.createdAt', pagination?.sort)
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
