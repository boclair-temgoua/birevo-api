import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Faq } from '../../../../models/Faq';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneFaqSelections } from '../../types';

@Injectable()
export class FindOneFaqByService {
  constructor(
    @InjectRepository(Faq)
    private driver: Repository<Faq>,
  ) {}

  async findOneBy(selections: GetOneFaqSelections): Promise<Faq> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('faq')
      .select('faq.title', 'title')
      .addSelect('faq.status', 'status')
      .addSelect('faq.type', 'type')
      .addSelect('faq.slug', 'slug')
      .addSelect('faq.description', 'description')
      .where('faq.deletedAt IS NULL');

    if (option1) {
      const { faq_uuid } = { ...option1 };
      query = query.andWhere('faq.uuid = :uuid', {
        uuid: faq_uuid,
      });
    }

    if (option2) {
      const { faqId } = { ...option2 };
      query = query.andWhere('faq.id = :id', { id: faqId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error) throw new HttpException('Faq not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
