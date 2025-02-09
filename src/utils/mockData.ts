import {
  AuditTrailCollection,
  DriverCollection,
  UserCollection,
} from '@/service/collection';
import { DriverStatus, Role } from './enum';

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

export const diversData: DriverCollection[] = [
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
    name: 'Lê Văn D',
    birthday: '25-01-2000',
    phone: '0328087570',
    address: '50 Trịnh Đình Trọng, Tân Phú, TP.HCM',
    vehicle: 'Vario',
    licensePlate: '77F1-777.27',
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
      {
        customer: 'Nguyễn Văn B',
        title: 'Lịch sự',
        rating: 4,
      },
    ],
    status: DriverStatus.ACTIVE,
  },
  {
    id: '4',
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

export const auditTrail: AuditTrailCollection[] = [];
