import dyaxios from '../config/dyaxios';
import { GetOneIpRequest } from '../types/index';

/** Config Json https://ip-api.com/docs/api:json */
export const getOneLocationIpApi = async (payload: GetOneIpRequest) => {
  const { data } = await dyaxios.get(
    `/json/${payload?.ipLocation}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`,
  );

  return data;
};
