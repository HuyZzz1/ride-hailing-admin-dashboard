export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  total?: number;
};

export type PaginationRequest = {
  filter?: any;
  search?: string;
  sort?: object;
  limit?: number;
  page?: number;
};
