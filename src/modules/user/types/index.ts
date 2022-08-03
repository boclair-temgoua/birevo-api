import { User } from '../../../models/User';

export type GetUsersSelections = {
  filterQuery?: any;
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
  };
};

export type GetOneUserSelections = {
  option1?: {
    userId?: User['id'];
  };
  option2?: {
    email?: User['email'];
  };
  option3?: {
    profileId?: User['profileId'];
  };
};

export type UpdateUserSelections = {
  option1?: {
    userId?: User['id'];
  };
  option2?: {
    email?: User['email'];
  };
  option3?: {
    profileId?: User['profileId'];
  };
};

export type CreateUserOptions = Partial<User>;

export type UpdateUserOptions = Partial<User>;
