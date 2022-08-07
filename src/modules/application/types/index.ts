import { Application } from '../../../models/Application';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetApplicationsSelections = {
  filterQuery?: any;
  data?: any[];
  option1?: {
    userId: Application['userId'];
  };
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
};

export type GetOneApplicationSelections = {
  option1?: {
    application_uuid: Application['uuid'];
  };
  option2?: {
    applicationId: Application['id'];
  };
};

export type UpdateApplicationSelections = {
  option1?: {
    application_uuid: Application['uuid'];
  };
  option2?: {
    applicationId: Application['id'];
  };
};

export type CreateApplicationOptions = Partial<Application>;

export type UpdateApplicationOptions = Partial<Application>;
