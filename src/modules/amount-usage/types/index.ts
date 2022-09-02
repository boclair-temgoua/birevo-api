import { AmountUsage } from '../../../models/AmountUsage';

export type GetAmountUsageSelections = {
  data?: any[];
  option1?: {
    userId: AmountUsage['userId'];
  };
  option2?: {
    organizationId: AmountUsage['organizationId'];
  };
  option3?: {
    userId: AmountUsage['userId'];
    organizationId: AmountUsage['organizationId'];
  };
};

export type GetOneAmountUsageSelections = {
  option1?: {
    amountUsageId: AmountUsage['id'];
  };
};

export type UpdateAmountUsageSelections = {
  option1?: {
    amountUsageId: AmountUsage['id'];
  };
};

export type CreateAmountUsageOptions = Partial<AmountUsage>;

export type UpdateAmountUsageOptions = Partial<AmountUsage>;
