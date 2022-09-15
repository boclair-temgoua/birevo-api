import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from '../../models/Testimonial';
import { FindOneTestimonialByService } from './services/query/find-one-testimonial-by.service';
import {
  CreateOrUpdateTestimonialController,
  GetOneOrMultipleTestimonialController,
} from './controllers';
import { FindTestimonialService } from './services/query/find-testimonial.service';
import { CreateOrUpdateTestimonialService } from './services/mutations/create-or-update-testimonial.service';
import { CreateOrUpdateTestimonial } from './services/use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  controllers: [
    CreateOrUpdateTestimonialController,
    GetOneOrMultipleTestimonialController,
  ],
  providers: [
    /** Imports providers query */
    FindOneTestimonialByService,
    FindTestimonialService,

    /** Imports providers mutations */
    CreateOrUpdateTestimonialService,

    /** Imports providers use-cases */
    CreateOrUpdateTestimonial,
  ],
})
export class TestimonialModule {}
