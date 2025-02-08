import axiosInstance from '../axios-instance';
import { API_ENDPOINTS } from '../endpoint';

export const profileQuery = async () => {
  return await axiosInstance.post(API_ENDPOINTS.USER.ME);
};
