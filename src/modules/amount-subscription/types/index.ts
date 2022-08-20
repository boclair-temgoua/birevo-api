import { AmountSubscription } from '../../../models/AmountSubscription';

export type GetAmountSubscriptionSelections = {
  data?: any[];
  option1?: {
    userId: AmountSubscription['userId'];
  };
  option2?: {
    organizationId: AmountSubscription['organizationId'];
  };
  option3?: {
    userId: AmountSubscription['userId'];
    organizationId: AmountSubscription['organizationId'];
  };
};

export type GetOneAmountSubscriptionSelections = {
  option1?: {
    amountSubscriptionId: AmountSubscription['id'];
  };
};

export type UpdateAmountSubscriptionSelections = {
  option1?: {
    amountSubscriptionId: AmountSubscription['id'];
  };
};

export type CreateAmountSubscriptionOptions = Partial<AmountSubscription>;

export type UpdateAmountSubscriptionOptions = Partial<AmountSubscription>;
