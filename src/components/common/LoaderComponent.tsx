import { Spin } from 'antd';
import React from 'react';

const LoaderComponent = () => {
  return (
    <div className='flex items-center justify-center flex-col w-full h-full'>
      <Spin spinning size='large' />
    </div>
  );
};

export default LoaderComponent;
