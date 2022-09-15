import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateTestimonialService } from '../mutations/create-or-update-testimonial.service';
import { CreateOrUpdateTestimonialDto } from '../../dto/validation-testimonial.dto';
import { FindOneTestimonialByService } from '../query/find-one-testimonial-by.service';

@Injectable()
export class CreateOrUpdateTestimonial {
  constructor(
    private readonly createOrUpdateTestimonialService: CreateOrUpdateTestimonialService,
    private readonly findOneTestimonialByService: FindOneTestimonialByService,
  ) {}

  /** Create one Testimonial Or Update to the database. */
  async createOrUpdate(options: CreateOrUpdateTestimonialDto): Promise<any> {
    const {
      testimonial_uuid,
      fullName,
      occupation,
      rete,
      link,
      image,
      description,
      user,
    } = { ...options };

    if (testimonial_uuid) {
      const [error, findTestimonial] = await useCatch(
        this.findOneTestimonialByService.findOneBy({
          option1: { testimonial_uuid },
        }),
      );
      if (error) {
        throw new NotFoundException(error);
      }
      if (!findTestimonial)
        throw new HttpException(
          `Testimonial invalid or don't exist`,
          HttpStatus.NOT_FOUND,
        );
      const [errorUpdate, update] = await useCatch(
        this.createOrUpdateTestimonialService.updateOne(
          { option1: { testimonial_uuid } },
          { fullName, occupation, rete, link, image, description },
        ),
      );
      if (errorUpdate) {
        throw new NotFoundException(errorUpdate);
      }

      return update;
    } else {
      const [__errorSave, newTestimonial] = await useCatch(
        this.createOrUpdateTestimonialService.createOne({
          userId: user?.id,
          userCreatedId: user?.id,
          fullName,
          occupation,
          rete,
          link,
          image,
          description,
        }),
      );
      if (__errorSave) {
        throw new NotFoundException(__errorSave);
      }
      return newTestimonial;
    }
  }
}
