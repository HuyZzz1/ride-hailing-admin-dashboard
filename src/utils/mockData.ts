import { BookingCollection, UserCollection } from '@/service/collection';
import { RideStatus, Role } from './enum';

export const users: UserCollection[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '123123',
    role: Role.ADMIN,
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@gmail.com',
    password: '123123',
    role: Role.STAFF,
  },
];

export const bookings: BookingCollection[] = [
  {
    id: '1',
    customer: 'Nguyễn Văn A',
    formAddress: '4 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    toAddress: '10 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    driver: 'Trần Văn A',
    status: RideStatus.PENDING,
    createdAt: new Date('02-08-2025'),
  },
  {
    id: '2',
    customer: 'Nguyễn Văn B',
    formAddress: '10 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    toAddress: '20 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    driver: 'Trần Văn B',
    status: RideStatus.COMPLETED,
    createdAt: new Date('02-07-2025'),
  },
  {
    id: '3',
    customer: 'Nguyễn Văn C',
    formAddress: '10 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    toAddress: '20 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    driver: 'Trần Văn C',
    status: RideStatus.IN_PROGRESS,
    createdAt: new Date('02-05-2025'),
  },
  {
    id: '4',
    customer: 'Nguyễn Văn D',
    formAddress: '10 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    toAddress: '20 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    driver: 'Trần Văn C',
    status: RideStatus.IN_PROGRESS,
    createdAt: new Date('02-05-2025'),
  },
  {
    id: '5',
    customer: 'Nguyễn Văn E',
    formAddress: '10 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    toAddress: '20 Trịnh Đình Thảo, Hòa Thạnh, Tân Phú',
    driver: 'Trần Văn C',
    status: RideStatus.IN_PROGRESS,
    createdAt: new Date('02-05-2025'),
  },
];
