import { SortType } from './request-pagination.dto';
export const withPagination = async <T>(options: {
  data: T;
  rowCount: number;
  pagination: { page: number; limit: number; sort: SortType };
}) => {
  const { rowCount, data, pagination } = { ...options };
  return {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? 0,
    sort: pagination?.sort ?? 'DESC',
    count: rowCount,
    total_pages: Math.ceil(rowCount / pagination.limit),
    data,
  };
};
