import dyaxios from '../config/dyaxios';
import { GetOneVoucherRequest } from '../types/index';

export const getOneVoucherApi = async (payload: GetOneVoucherRequest) => {
  const { data } = await dyaxios.get<any>(`/vouchers/show/${payload?.code}`);
  return data;
};

export const getOneCouponApi = async (payload: GetOneVoucherRequest) => {
  const { data } = await dyaxios.get<any>(`/coupons/show/${payload?.code}`);
  return data;
};

export const useOneCouponApi = async (payload: GetOneVoucherRequest) => {
  const { data } = await dyaxios.put<GetOneVoucherRequest>(
    `/coupons/use/${payload?.code}`,
  );
  return data;
};
