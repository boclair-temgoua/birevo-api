import { Amount } from '../../../models/Amount';
import { SortType } from '../../../infrastructure/utils/pagination/request-pagination.dto';

export type GetAmountSelections = {
  option1?: {
    userId: Amount['userId'];
  };
  option2?: {
    organizationId: Amount['organizationId'];
  };
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneAmountSelections = {
  option1?: {
    amountId: Amount['id'];
  };
};

export type CreateAmountOptions = Partial<Amount>;

export type UpdateAmountOptions = Partial<Amount>;
