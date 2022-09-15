import { Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from '../../../../models/Testimonial';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { generateUUID } from '../../../../infrastructure/utils/commons';
import {
  CreateTestimonialOptions,
  UpdateTestimonialOptions,
  UpdateTestimonialSelections,
} from '../../types';

@Injectable()
export class CreateOrUpdateTestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private driver: Repository<Testimonial>,
  ) {}

  /** Create one Testimonial to the database. */
  async createOne(options: CreateTestimonialOptions): Promise<Testimonial> {
    const {
      userId,
      userCreatedId,
      fullName,
      occupation,
      rete,
      link,
      image,
      description,
    } = { ...options };

    const testimonial = new Testimonial();
    testimonial.uuid = generateUUID();
    testimonial.userId = userId;
    testimonial.userCreatedId = userCreatedId;
    testimonial.fullName = fullName;
    testimonial.occupation = occupation;
    testimonial.rete = rete;
    testimonial.image = image;
    testimonial.link = link;
    testimonial.description = description;

    const query = this.driver.save(testimonial);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Testimonial to the database. */
  async updateOne(
    selections: UpdateTestimonialSelections,
    options: UpdateTestimonialOptions,
  ): Promise<Testimonial> {
    const { option1, option2 } = { ...selections };
    const { fullName, occupation, rete, link, image, description, deletedAt } =
      { ...options };

    let findQuery = this.driver.createQueryBuilder('testimonial');

    if (option1) {
      findQuery = findQuery.where('testimonial.uuid = :uuid', {
        uuid: option1.testimonial_uuid,
      });
    }

    if (option2) {
      findQuery = findQuery.where('testimonial.id = :id', {
        id: option2.testimonialId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.fullName = fullName;
    findItem.occupation = occupation;
    findItem.rete = rete;
    findItem.link = link;
    findItem.image = image;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
