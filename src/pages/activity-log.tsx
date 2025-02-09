import dynamic from 'next/dynamic';
import React from 'react';

const Page = dynamic(() => import('@/components/pages/ActivityLog'), {
  ssr: false,
});

const Home = () => {
  return <Page />;
};

export default Home;
