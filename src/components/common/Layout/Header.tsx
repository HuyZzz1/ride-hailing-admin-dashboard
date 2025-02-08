import { Avatar, Tag } from 'antd';
import React from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { StyledDropDownAccount } from './styled';
import { signOut } from 'next-auth/react';
import { PAGE_ROUTES } from '@/utils/routes';
import dynamic from 'next/dynamic';
import { useRecoilState } from 'recoil';
import { DEFAULT_USER_RECOIL_STATE, userRecoil } from '@/service/recoil/user';

const Dropdown = dynamic(() => import('antd/es/dropdown'), { ssr: false });

const Header = () => {
  const [user, setUser] = useRecoilState(userRecoil);

  const onLogout = async () => {
    setUser({
      ...DEFAULT_USER_RECOIL_STATE,
      isLoading: false,
    });
    await signOut({ callbackUrl: PAGE_ROUTES.SIGN_IN });
  };

  return (
    <div className='flex items-center justify-between px-4 w-full h-full'>
      <h1 className='text-violet-500 font-bold uppercase text-xl'>Moovtek</h1>
      <StyledDropDownAccount id='styled-dropdown'>
        <Dropdown
          getPopupContainer={() =>
            document.getElementById('styled-dropdown') || document.body
          }
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <div className='w-full flex flex-col items-center justify-center'>
                    <p className='font-medium'>{user?.name}</p>
                    <p className='font-medium'>{user?.email}</p>
                  </div>
                ),
              },
              {
                type: 'divider',
              },
              {
                key: '2',
                icon: (
                  <LogoutOutlined
                    style={{
                      fontSize: 16,
                    }}
                    className='text-red-500'
                  />
                ),
                label: <span className='text-red-500'>Logout</span>,
                onClick: () => onLogout(),
              },
            ],
          }}
        >
          <div className='flex items-center justify-center gap-2.5'>
            <Tag color='green' className='font-medium mt-2.5 uppercase'>
              {user?.role}
            </Tag>
            <Avatar
              size='large'
              icon={<UserOutlined />}
              className='cursor-pointer'
            />
          </div>
        </Dropdown>
      </StyledDropDownAccount>
    </div>
  );
};

export default Header;
