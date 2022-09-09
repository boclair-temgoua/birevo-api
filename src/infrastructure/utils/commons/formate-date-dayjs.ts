import * as dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const formateDateMountYear = (date: Date) => {
  return dayjs(date).format('MMMM YYYY');
};

export const formateDateDDMMYYDayjs = (date: Date) => {
  const dateInit = dayjs(date);
  return dateInit.format('MM/DD/YYYY');
};

export const formateDateMMDDYYDayjs = (date: Date) => {
  const dateInit = dayjs(date);
  return dateInit.format('MM/DD/YYYY');
};
