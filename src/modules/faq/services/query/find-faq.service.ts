import { Injectable, NotFoundException } from '@nestjs/common';
import { Faq } from '../../../../models/Faq';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetFaqsSelections } from '../../types';

@Injectable()
export class FindFaqService {
  constructor(
    @InjectRepository(Faq)
    private driver: Repository<Faq>,
  ) {}

  async findAll(selections: GetFaqsSelections): Promise<GetFaqsSelections> {
    const { filterQuery, type, pagination, option1 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('faq')
      .select('faq.title', 'title')
      .addSelect('faq.status', 'status')
      .addSelect('faq.type', 'type')
      .addSelect('faq.slug', 'slug')
      .addSelect('faq.description', 'description')
      .where('faq.status IS TRUE')
      .andWhere('faq.type = :type', { type })
      .andWhere('faq.deletedAt IS NULL');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('faq.userId = :userId', { userId });
    }

    if (filterQuery?.q) {
      query = query.andWhere('faq.title ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, faqs] = await useCatch(
      query
        .orderBy('faq.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit)
        .getRawMany(),
    );

    if (error) throw new NotFoundException(error);
    return withPagination({
      pagination,
      rowCount,
      data: faqs,
    });
  }
}
