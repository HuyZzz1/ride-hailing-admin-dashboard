import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

const Page = () => {
  const router = useRouter();
  return (
    <div className='w-full h-[calc(100vh-64px)] flex justify-center items-center gap-4 flex-col'>
      <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-semibold text-red-500'>404</h1>
        <h1 className='text-xl font-medium'>Sorry, the page not found</h1>
      </div>
      <div>
        <Button
          type='primary'
          size='large'
          className='flex items-center justify-center w-[250px] mt-5'
          onClick={() => router.back()}
        >
          Home
        </Button>
      </div>
    </div>
  );
};

export default Page;
