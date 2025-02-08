import { PaginationRequest } from '@/service/types';
import axiosInstance from '../axios-instance';
import { API_ENDPOINTS } from '../endpoint';

export const listBookingsQuery = async (params: PaginationRequest) => {
  return await axiosInstance.post(API_ENDPOINTS.BOOKINGS.LIST, { ...params });
};
