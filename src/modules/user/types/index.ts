import { User } from '../../../models/User';
import { SortType } from '../../../infrastructure/utils/pagination';
import { Nullable } from '../../../infrastructure/utils/use-catch';

export type JwtPayloadType = {
  id: number;
  uuid: string;
  profileId: number;
  organizationId: number;
  lastName: string;
  firstName: string;
};

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
    userId: User['id'];
  };
  option2?: {
    email: User['email'];
  };
  option3?: {
    profileId: User['profileId'];
  };
  option4?: {
    user_uuid: User['uuid'];
  };
  option5?: {
    token: User['token'];
  };
  option6?: {
    userId: User['id'];
    email: User['email'];
  };
};

export type UpdateUserSelections = {
  option1?: {
    userId: User['id'];
  };
  option2?: {
    email: User['email'];
  };
  option3?: {
    profileId: User['profileId'];
  };
  option4?: {
    user_uuid: User['uuid'];
  };
};

export type CreateUserOptions = Partial<User>;

export type UpdateUserOptions = Partial<User>;
