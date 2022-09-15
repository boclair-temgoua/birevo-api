import { Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from '../../../../models/Testimonial';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetTestimonialsSelections } from '../../types';

@Injectable()
export class FindTestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private driver: Repository<Testimonial>,
  ) {}

  async findAll(
    selections: GetTestimonialsSelections,
  ): Promise<GetTestimonialsSelections> {
    const { filterQuery, pagination, option1 } = { ...selections };

    let query = this.driver
      .createQueryBuilder('testimonial')
      .where('testimonial.deletedAt IS NULL');

    if (option1) {
      const { userId } = { ...option1 };
      query = query.andWhere('testimonial.userId = :userId', { userId });
    }

    if (filterQuery?.q) {
      query = query.andWhere('testimonial.name ::text ILIKE :searchQuery', {
        searchQuery: `%${filterQuery?.q}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, results] = await useCatch(
      query
        .orderBy('testimonial.createdAt', pagination?.sort)
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
