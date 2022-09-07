import { Injectable, NotFoundException } from '@nestjs/common';
import { Faq } from '../../../../models/Faq';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import {
  CreateFaqOptions,
  UpdateFaqOptions,
  UpdateFaqSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateFaqService {
  constructor(
    @InjectRepository(Faq)
    private driver: Repository<Faq>,
  ) {}

  /** Create one Faq to the database. */
  async createOne(options: CreateFaqOptions): Promise<Faq> {
    const { userId, userCreatedId, title, description } = { ...options };

    const faq = new Faq();
    faq.uuid = generateUUID();
    faq.userId = userId;
    faq.title = title;
    faq.userCreatedId = userCreatedId;
    faq.description = description;

    const query = this.driver.save(faq);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Faq to the database. */
  async updateOne(
    selections: UpdateFaqSelections,
    options: UpdateFaqOptions,
  ): Promise<Faq> {
    const { option1, option2 } = { ...selections };
    const { title, description, status, deletedAt } = { ...options };

    let findQuery = this.driver.createQueryBuilder('faq');

    if (option1) {
      findQuery = findQuery.where('faq.uuid = :uuid', {
        uuid: option1.faq_uuid,
      });
    }

    if (option2) {
      findQuery = findQuery.where('faq.id = :id', {
        id: option2.faqId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.description = description;
    findItem.status = status;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
