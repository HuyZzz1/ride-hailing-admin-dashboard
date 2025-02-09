import { PaginationRequest } from '@/service/types';
import axiosInstance from '../axios-instance';
import { API_ENDPOINTS } from '../endpoint';

export const listActivityLogQuery = async (params: PaginationRequest) => {
  return await axiosInstance.post(API_ENDPOINTS.ACTIVITY_LOG.LIST, {
    ...params,
  });
};
