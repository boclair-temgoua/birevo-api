import { AmountBalance } from '../../../models/AmountBalance';

export type GetAmountBalanceSelections = {
  data?: any[];
  option1?: {
    userId: AmountBalance['userId'];
  };
  option2?: {
    organizationId: AmountBalance['organizationId'];
  };
  option3?: {
    userId: AmountBalance['userId'];
    organizationId: AmountBalance['organizationId'];
  };
};

export type GetOneAmountBalanceSelections = {
  option1?: {
    amountBalanceId: AmountBalance['id'];
  };
};

export type UpdateAmountBalanceSelections = {
  option1?: {
    amountBalanceId: AmountBalance['id'];
  };
};

export type CreateAmountBalanceOptions = Partial<AmountBalance>;

export type UpdateAmountBalanceOptions = Partial<AmountBalance>;
