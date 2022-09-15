import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Testimonial } from '../../../../models/Testimonial';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { GetOneTestimonialSelections } from '../../types';

@Injectable()
export class FindOneTestimonialByService {
  constructor(
    @InjectRepository(Testimonial)
    private driver: Repository<Testimonial>,
  ) {}

  async findOneBy(
    selections: GetOneTestimonialSelections,
  ): Promise<Testimonial> {
    const { option1, option2 } = { ...selections };
    let query = this.driver
      .createQueryBuilder('testimonial')
      .where('testimonial.deletedAt IS NULL');

    if (option1) {
      const { testimonial_uuid } = { ...option1 };
      query = query.andWhere('testimonial.uuid = :uuid', {
        uuid: testimonial_uuid,
      });
    }

    if (option2) {
      const { testimonialId } = { ...option2 };
      query = query.andWhere('testimonial.id = :id', { id: testimonialId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Testimonial not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
