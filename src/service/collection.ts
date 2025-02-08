import { RideStatus, Role } from '@/utils/enum';

export type UserCollection = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type BookingCollection = {
  id: string;
  customer: string;
  formAddress: string;
  toAddress: string;
  driver: string;
  status: RideStatus;
  createdAt: Date;
};
