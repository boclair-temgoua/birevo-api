import { Faq } from '../../../models/Faq';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetFaqsSelections = {
  filterQuery?: any;
  data?: any[];
  option1?: {
    userId: Faq['userId'];
  };
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneFaqSelections = {
  option1?: {
    faq_uuid: Faq['uuid'];
  };
  option2?: {
    faqId: Faq['id'];
  };
};

export type UpdateFaqSelections = {
  option1?: {
    faq_uuid: Faq['uuid'];
  };
  option2?: {
    faqId: Faq['id'];
  };
};

export type CreateFaqOptions = Partial<Faq>;

export type UpdateFaqOptions = Partial<Faq>;
