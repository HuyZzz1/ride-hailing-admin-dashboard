import dynamic from 'next/dynamic';
import React from 'react';

const Page = dynamic(() => import('@/components/pages/SignIn'), {
  ssr: false,
});

const SignIn = () => {
  return <Page />;
};

export default SignIn;
