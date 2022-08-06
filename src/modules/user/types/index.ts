import { User } from '../../../models/User';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetUsersSelections = {
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
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
  option4?: {
    user_uuid?: User['uuid'];
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
