import dyaxios from '../config/dyaxios';
import { GetOneVoucherRequest } from '../types/index';

export const getOneVoucherApi = (payload: GetOneVoucherRequest) => {
  return dyaxios.get<any>(`/coupons/show/${payload?.code}`);
};

export const useOneVoucherApi = (payload: GetOneVoucherRequest) => {
  return dyaxios.put<GetOneVoucherRequest>(`/coupons/use/${payload?.code}`);
};
