import { PaginationRequest } from '@/service/types';
import axiosInstance from '../axios-instance';
import { API_ENDPOINTS } from '../endpoint';
import { CreateBookingParams, EditBookingParams } from './type';

export const listBookingsQuery = async (params: PaginationRequest) => {
  return await axiosInstance.post(API_ENDPOINTS.BOOKINGS.LIST, { ...params });
};

export const createBookingQuery = async (params: CreateBookingParams) => {
  return await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CREATE, params);
};

export const editBookingQuery = async (params: EditBookingParams) => {
  return await axiosInstance.put(API_ENDPOINTS.BOOKINGS.EDIT, params);
};

export const deleteBookingQuery = async (params: { id: string }) => {
  return await axiosInstance.post(API_ENDPOINTS.BOOKINGS.DELETE, params);
};

export const deleteMultipleBookingQuery = async (params: { ids: string[] }) => {
  return await axiosInstance.post(
    API_ENDPOINTS.BOOKINGS.DELETE_MULTIPLE,
    params
  );
};
