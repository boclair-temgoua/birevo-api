import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contact } from '../../../../models/Contact';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneContactSelections } from '../../types';

@Injectable()
export class FindOneContactByService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findOneBy(selections: GetOneContactSelections): Promise<Contact> {
    const { option1, option2, option3 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('contact')
      .select('contact.id', 'id')
      .addSelect('contact.uuid', 'uuid')
      .addSelect('contact.slug', 'slug')
      .addSelect('contact.lastName', 'lastName')
      .addSelect('contact.email', 'email')
      .addSelect('contact.createdAt', 'createdAt')
      .where('contact.deletedAt IS NULL');

    if (option1) {
      const { contactId } = { ...option1 };
      query = query.andWhere('contact.id = :id', { id: contactId });
    }

    if (option2) {
      const { contact_slug } = { ...option2 };
      query = query.andWhere('contact.slug = :slug', { slug: contact_slug });
    }

    if (option3) {
      const { contact_uuid } = { ...option3 };
      query = query.andWhere('contact.uuid = :uuid', { uuid: contact_uuid });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
