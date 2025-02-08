import { Role } from './enum';

export const users: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}[] = [
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
