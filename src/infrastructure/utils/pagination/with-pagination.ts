export const withPagination = async <T>(options: {
    data: T;
    rowCount: number;
    pagination: { page: number; limit: number };
}) => {
    const { rowCount, data, pagination } = { ...options };
    return {
        page: pagination?.page ?? 1,
        limit: pagination?.limit ?? 0,
        count: rowCount,
        total_pages: Math.ceil(rowCount / pagination.limit),
        data,
    };
};
