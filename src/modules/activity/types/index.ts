import { Activity } from '../../../models/Activity';
import { SortType } from '../../../infrastructure/utils/pagination/request-pagination.dto';

export type GetActivitySelections = {
  option1?: {
    activityAbleType: Activity['activityAbleType'];
    activityAbleId: Activity['activityAbleId'];
  };
  option2?: {
    organizationId: Activity['organizationId'];
  };
  filterQuery?: any;
  data?: any[];
  isVoucherFilter?: string;
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneActivitySelections = {
  option1?: {
    ipLocation: Activity['ipLocation'];
    action: Activity['action'];
  };
  option2?: {
    activity_uuid: Activity['uuid'];
  };
};

export type UpdateActivitySelections = {
  option1?: {
    activityId?: Activity['id'];
  };
};

export type CreateActivityOptions = Partial<Activity>;

export type UpdateActivityOptions = Partial<Activity>;
