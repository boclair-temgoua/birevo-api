import { Testimonial } from '../../../models/Testimonial';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetTestimonialsSelections = {
  filterQuery?: any;
  data?: any[];
  option1?: {
    userId: Testimonial['userId'];
  };
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneTestimonialSelections = {
  option1?: {
    testimonial_uuid: Testimonial['uuid'];
  };
  option2?: {
    testimonialId: Testimonial['id'];
  };
};

export type UpdateTestimonialSelections = {
  option1?: {
    testimonial_uuid: Testimonial['uuid'];
  };
  option2?: {
    testimonialId: Testimonial['id'];
  };
};

export type CreateTestimonialOptions = Partial<Testimonial>;

export type UpdateTestimonialOptions = Partial<Testimonial>;
