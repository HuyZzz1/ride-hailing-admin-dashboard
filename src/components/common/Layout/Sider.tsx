import {
  BookOutlined,
  FileSyncOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import Link from 'next/link';
import _compact from 'lodash/compact';
import { PAGE_ROUTES } from '@/utils/routes';
import { useWindowWidth } from '@/service/hooks/useWindowWidth';

const { Sider } = Layout;

export enum TAB_KEY {
  BOOKING = 'Booking',
  DRIVER = 'Driver',
  ACTIVITY_LOG = 'ActivityLog',
}

const CustomSider = () => {
  const router = useRouter();
  const widthScreen = useWindowWidth();
  const [activeKey, setActiveKey] = useState(router.pathname);
  const [collapsed, setCollapsed] = useState(false);

  const menus = _compact([
    {
      key: TAB_KEY.BOOKING,
      groups: [PAGE_ROUTES.BOOKING],
      icon: (
        <BookOutlined
          style={{
            fontSize: 18,
          }}
        />
      ),
      label: <Link href={PAGE_ROUTES.BOOKING}>Booking Management</Link>,
    },
    {
      key: TAB_KEY.DRIVER,
      groups: [PAGE_ROUTES.DRIVER],
      icon: (
        <UsergroupAddOutlined
          style={{
            fontSize: 18,
          }}
        />
      ),
      label: <Link href={PAGE_ROUTES.DRIVER}>Driver Management</Link>,
    },
    {
      key: TAB_KEY.ACTIVITY_LOG,
      groups: [PAGE_ROUTES.ACTIVITY_LOG],
      icon: (
        <FileSyncOutlined
          style={{
            fontSize: 18,
          }}
        />
      ),
      label: <Link href={PAGE_ROUTES.ACTIVITY_LOG}>Activity Log</Link>,
    },
  ]);

  useEffect(() => {
    const item = menus.find((a) => a.groups.includes(router.pathname));

    setActiveKey(item?.key as string);
  }, [router.pathname]);

  useEffect(() => {
    if (Number(widthScreen) < 768) {
      setCollapsed(true);
    }
  }, [widthScreen]);

  return (
    <>
      <div className='h-[calc(100vh-64px)]'>
        <Sider
          className='h-full'
          width={240}
          collapsedWidth={60}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className='w-full h-full flex flex-col overflow-auto pt-2.5 justify-between'>
            <Menu
              theme='dark'
              mode='inline'
              selectedKeys={[activeKey]}
              items={menus}
            />
          </div>
        </Sider>
      </div>
    </>
  );
};

export default CustomSider;
