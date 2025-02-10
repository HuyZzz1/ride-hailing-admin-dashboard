import { Role } from '@/utils/enum';
import { atom } from 'recoil';

type UserState = {
  isLoading: boolean;
  refreshUser: boolean;
  id: string;
  email: string;
  name: string;
  role?: Role;
};

export const DEFAULT_USER_RECOIL_STATE = {
  isLoading: true,
  refreshUser: false,
  id: '',
  email: '',
  name: '',
};

export const userRecoil = atom<UserState>({
  key: 'userRecoilState',
  default: DEFAULT_USER_RECOIL_STATE,
});
