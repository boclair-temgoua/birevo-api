import { generateLongUUID } from '../../../../infrastructure/utils/commons/generate-long-uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../../../../models/Contact';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons/generate-uuid';
import { CreateContactOptions } from '../../types/index';

@Injectable()
export class CreateContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async createOne(options: CreateContactOptions): Promise<Contact> {
    const { email, lastName, description, subject } = {
      ...options,
    };

    const contact = new Contact();
    contact.uuid = generateUUID();
    contact.slug = generateLongUUID(10);
    contact.email = email;
    contact.description = description;
    contact.subject = subject;
    contact.lastName = lastName;

    const query = this.contactRepository.save(contact);

    const [error, contactSaved] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return contactSaved;
  }
}
