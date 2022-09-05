import dyaxios from '../config/dyaxios';
import { GetOneIpRequest } from '../types/index';

/** https://ipapi.co/api/?shell#introduction */
export const getOneIpLocationApi = async (payload: GetOneIpRequest) => {
  const { data } = await dyaxios.get<any>(`/${payload?.ipLocation}/json`);
  return data;
};
