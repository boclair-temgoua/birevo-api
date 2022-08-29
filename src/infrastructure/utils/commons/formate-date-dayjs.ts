import * as dayjs from 'dayjs';
dayjs().locale('fr').format();

export const formateDateDayjs = () => {
  return dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss');
};
