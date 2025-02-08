import { memo } from 'react';
import { Layout as LayoutAntd } from 'antd';
import Header from './Header';
import CustomSider from './Sider';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutAntd className='w-full h-screen overflow-hidden'>
      <LayoutAntd.Header
        className='bg-white !pr-4 z-[999]'
        style={{
          paddingInline: 0,
        }}
      >
        <Header />
      </LayoutAntd.Header>
      <LayoutAntd>
        <CustomSider />
        <LayoutAntd.Content
          className='overflow-y-auto h-[calc(100vh-64px)]'
          id='main-component-layout'
        >
          {children}
        </LayoutAntd.Content>
      </LayoutAntd>
    </LayoutAntd>
  );
};

export default memo(Layout);
