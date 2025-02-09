import { ActionAudit, DriverStatus, RideStatus, Role } from '@/utils/enum';

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
  driver?: string;
  driverId?: string;
  status: RideStatus;
  createdAt: Date;
};

export type DriverCollection = {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  address: string;
  vehicle: string;
  licensePlate: string;
  rating: number;
  completedRides: number;
  review: {
    customer: string;
    title: string;
    rating: number;
  }[];
  status: DriverStatus;
};

export type AuditTrailCollection = {
  id: string;
  action: ActionAudit;
  user: string;
  bookingId: string;
  createdAt: Date;
  details: string;
};
