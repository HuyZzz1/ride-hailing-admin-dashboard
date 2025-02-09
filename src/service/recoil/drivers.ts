import { atom } from 'recoil';

export const DEFAULT_STATE = {
  id: '',
  name: '',
};

export const driversRecoil = atom<
  {
    id: string;
    name: string;
  }[]
>({
  key: 'driversRecoilState',
  default: [DEFAULT_STATE],
});
