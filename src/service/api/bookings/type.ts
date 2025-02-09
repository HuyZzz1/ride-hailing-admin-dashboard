import { RideStatus } from '@/utils/enum';

export type CreateBookingParams = {
  customer: string;
  formAddress: string;
  toAddress: string;
  driverId: string;
  status: RideStatus;
};

export type EditBookingParams = CreateBookingParams & {
  id: string;
};
