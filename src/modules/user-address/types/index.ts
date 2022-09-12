import { UserAddress } from '../../../models/UserAddress';

export type GetCurrenciesSelections = {
  filterQuery?: any;
  option1?: {
    userId: UserAddress['userId'];
  };
  option2?: {
    organizationId: UserAddress['organizationId'];
  };
};

export type GetOneUserAddressSelections = {
  option1?: {
    user_address_uuid: UserAddress['uuid'];
  };
};

export type UpdateUserAddressSelections = {
  option1?: {
    user_address_uuid: UserAddress['uuid'];
  };
};

export type CreateUserAddressOptions = Partial<UserAddress>;

export type UpdateUserAddressOptions = Partial<UserAddress>;
