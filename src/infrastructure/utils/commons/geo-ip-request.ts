import * as geoip from 'geoip-lite';

export const geoIpRequest = (ip: string) => {
  return geoip.lookup(ip);
};
