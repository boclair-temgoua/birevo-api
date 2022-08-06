import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../../../../models/Contact';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { withPagination } from '../../../../infrastructure/utils/pagination';
import { GetContactsSelections } from '../../types';

@Injectable()
export class FindContactService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findAllContacts(
    selections: GetContactsSelections,
  ): Promise<GetContactsSelections> {
    const { filterQuery, pagination } = { ...selections };

    let query = this.driver
      .createQueryBuilder('contact')
      .select('contact.id', 'id')
      .addSelect('contact.uuid', 'uuid')
      .addSelect('contact.slug', 'slug')
      .addSelect('contact.lastName', 'lastName')
      .addSelect('contact.email', 'email')
      .addSelect('contact.createdAt', 'createdAt')
      .where('contact.deletedAt IS NULL');

    if (filterQuery?.q) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('contact.email ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          }).orWhere('contact.lastName ::text ILIKE :searchQuery', {
            searchQuery: `%${filterQuery?.q}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, results] = await useCatch(
      query
        .orderBy('contact.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      data: results,
    });
  }
}
