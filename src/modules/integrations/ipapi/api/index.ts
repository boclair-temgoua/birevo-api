import dyaxios from '../config/dyaxios';
import { GetOneIpRequest } from '../types/index';

export const getOneIpLocationApi = (payload: GetOneIpRequest) => {
  return dyaxios.get<any>(`/${payload?.ipLocation}/json`);
};
