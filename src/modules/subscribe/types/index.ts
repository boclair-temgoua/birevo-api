import { Subscribe } from '../../../models/Subscribe';
import { SortType } from '../../../infrastructure/utils/pagination';

export type GetSubscribesSelections = {
  filterQuery?: any;
  data?: any[];
  pagination?: {
    sort: SortType;
    page: number;
    limit: number;
  };
  option1?: {
    userId: Subscribe['userId'];
    subscribableType: Subscribe['subscribableType'];
  };
  option2?: {
    subscribableId: Subscribe['subscribableId'];
    subscribableType: Subscribe['subscribableType'];
  };
};

export type GetOneSubscribeSelections = {
  option1?: {
    userId: Subscribe['userId'];
    subscribableId: Subscribe['subscribableId'];
    subscribableType: Subscribe['subscribableType'];
    organizationId: Subscribe['organizationId'];
  };
  option2?: {
    subscribeId: Subscribe['id'];
  };
  option3?: {
    subscribe_uuid: Subscribe['uuid'];
  };
};

export type UpdateSubscribeSelections = {
  option1?: {
    subscribeId: Subscribe['id'];
  };
  option2?: {
    subscribe_uuid: Subscribe['uuid'];
  };
};

export type DeleteSubscribeSelections = {
  option1?: {
    subscribe_uuid: Subscribe['uuid'];
  };
};

export type CreateSubscribeOptions = Partial<Subscribe>;

export type UpdateSubscribeOptions = Partial<Subscribe>;
