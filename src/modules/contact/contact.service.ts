import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contact } from './../../models/Contact';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../infrastructure/utils/use-catch';
import { withPagination } from '../../infrastructure/utils/pagination';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}
  getHello(): string {
    return 'Contact!';
  }

  async findAllContacts(pagination): Promise<any> {
    let query = this.contactRepository
      .createQueryBuilder('contact')
      .select('contact.id', 'id')
      .addSelect('contact.uuid', 'uuid')
      .addSelect('contact.slug', 'slug')
      .addSelect('contact.lastName', 'lastName')
      .addSelect('contact.email', 'email');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, contacts] = await useCatch(
      query
        .orderBy('contact.createdAt', 'DESC')
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit)
        .getRawMany(),
    );
    if (error) {
      throw new NotFoundException(error);
    }

    return withPagination({
      pagination,
      rowCount,
      data: contacts,
    });
  }
}
