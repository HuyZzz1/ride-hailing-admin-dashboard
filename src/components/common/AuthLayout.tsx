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
import { useRecoilState, useSetRecoilState } from 'recoil';
import Layout from './Layout';
import LoaderComponent from './LoaderComponent';
import { driversRecoil } from '@/service/recoil/drivers';
import { listDriversQuery } from '@/service/api/drivers';
import { DEFAULT_FILTER } from '@/utils/constant';
import { DriverStatus } from '@/utils/enum';
import { DriverCollection } from '@/service/collection';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { mutate: profileMutate } = useMutation({ mutationFn: profileQuery });
  const { mutate: driversMutate } = useMutation({
    mutationFn: listDriversQuery,
  });
  const [user, setUser] = useRecoilState(userRecoil);
  const setDrivers = useSetRecoilState(driversRecoil);

  const onGetProfile = () => {
    profileMutate({} as any, {
      onSuccess: ({ data }) => {
        if (UN_AUTH_ROUTES.includes(router.pathname)) {
          router.push(PAGE_ROUTES.BOOKING);
        }

        setUser({ ...data.data, isLoading: false });
      },

      onError: () => {
        router
          .push(PAGE_ROUTES.SIGN_IN)
          .then(() => setUser((prev) => ({ ...prev, isLoading: false })));
      },
    });
  };

  const onGetDrivers = () => {
    driversMutate(
      {
        ...DEFAULT_FILTER,
        filter: {
          status: DriverStatus.ACTIVE,
        },
      } as any,
      {
        onSuccess: ({ data }) => {
          setDrivers(
            data.docs.map((a: DriverCollection) => ({
              id: a?.id,
              name: a?.name,
            }))
          );
        },
      }
    );
  };

  useEffect(() => {
    if (!UN_FETCH_PROFILE_ROUTES.includes(router.pathname)) {
      onGetProfile();
    } else {
      setUser((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (!UN_AUTH_ROUTES.includes(router.pathname)) {
      onGetDrivers();
    }
  }, []);

  useEffect(() => {
    if (user.refreshUser) {
      onGetProfile();
      onGetDrivers();
    }
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
