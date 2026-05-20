export interface IPagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export type IPaginatedResponse<T = unknown> = {
  data: T;
  pagination: IPagination;
};
