import {
  BookingCollection,
  DriverCollection,
  UserCollection,
} from '@/service/collection';
import { DriverStatus, RideStatus, Role } from './enum';

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

export const divers: DriverCollection[] = [
  {
    id: '1',
    name: 'Lê Văn A',
    birthday: '19-08-2001',
    phone: '0328074572',
    address: '10 Trịnh Đình Trọng, Tân Phú, TP.HCM',
    vehicle: 'Sirius',
    licensePlate: '59V1-123.45',
    rating: 8.0,
    completedRides: 20,
    review: [
      {
        customer: 'Nguyễn Văn A',
        title: 'Chạy xe an toàn, lịch sự',
        rating: 5,
      },
      {
        customer: 'Nguyễn Văn A',
        title: 'Lịch sự',
        rating: 4.5,
      },
    ],
    status: DriverStatus.ACTIVE,
  },
  {
    id: '2',
    name: 'Lê Văn B',
    birthday: '25-01-2000',
    phone: '0328087570',
    address: '20 Trịnh Đình Trọng, Tân Phú, TP.HCM',
    vehicle: 'Vario',
    licensePlate: '77F1-777.77',
    rating: 7.0,
    completedRides: 15,
    review: [
      {
        customer: 'Nguyễn Văn A',
        title: 'Chạy xe an toàn, lịch sự',
        rating: 5,
      },
      {
        customer: 'Nguyễn Văn B',
        title: 'Lịch sự',
        rating: 4,
      },
    ],
    status: DriverStatus.ACTIVE,
  },
  {
    id: '3',
    name: 'Lê Văn C',
    birthday: '16-03-1999',
    phone: '0328022578',
    address: '92 Kênh Tân Hóa, Tân Phú, TP.HCM',
    vehicle: 'Sirius',
    licensePlate: '77F1-888.88',
    rating: 7.0,
    completedRides: 10,
    review: [
      {
        customer: 'Nguyễn Văn A',
        title: 'Chạy xe an toàn, lịch sự',
        rating: 5,
      },
    ],
    status: DriverStatus.DEACTIVATED,
  },
];
