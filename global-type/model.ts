export type PaginationQuery = {
  limit: number;
  pageNo: number;
};

export interface Pagination<T> extends PaginationQuery {
  data: T[];
  total: number;
}
