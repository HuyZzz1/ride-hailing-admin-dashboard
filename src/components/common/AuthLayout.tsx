import { memo, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { profileQuery } from '@/service/api/user';
import { useRouter } from 'next/router';
import {
  PAGE_ROUTES,
  UN_AUTH_ROUTES,
  UN_FETCH_PROFILE_ROUTES,
  UN_LAYOUT_ROUTES,
} from '@/utils/routes';
import { userRecoil } from '@/service/recoil/user';
import { useRecoilState } from 'recoil';
import Layout from './Layout';
import LoaderComponent from './LoaderComponent';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { mutate: profileMutate } = useMutation({ mutationFn: profileQuery });
  const [user, setUser] = useRecoilState(userRecoil);

  const onGetProfile = () => {
    profileMutate({} as any, {
      onSuccess: ({ data }) => {
        if (UN_AUTH_ROUTES.includes(router.pathname)) {
          router.push(PAGE_ROUTES.BOOKING);
        }

        setUser({ ...data, isLoading: false });
      },

      onError: () => {
        router
          .push(PAGE_ROUTES.SIGN_IN)
          .then(() => setUser((prev) => ({ ...prev, isLoading: false })));
      },
    });
  };

  useEffect(() => {
    if (!UN_FETCH_PROFILE_ROUTES.includes(router.pathname)) {
      onGetProfile();
    } else {
      setUser((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (user.refreshUser) onGetProfile();
  }, [user.refreshUser]);

  if (user.isLoading) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <LoaderComponent />
      </div>
    );
  }

  if (UN_LAYOUT_ROUTES.includes(router.pathname)) return <>{children}</>;

  return <Layout>{children}</Layout>;
};

export default memo(AuthLayout);
