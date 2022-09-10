import * as moment from 'moment';

export const formateDateMountYearMomentJs = (date: Date) => {
  return moment(date).format('MMMM YYYY');
};

export const formateDateDDMMYYMomentJs = (date: Date) => {
  return moment(date).format('DD/MM/YYYY');
};

export const formateDateMMDDYYMomentJs = (date: Date) => {
  return moment(date).format('MM/DD/YYYY');
};
