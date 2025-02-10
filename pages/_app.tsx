import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import Head from 'next/head';
import { ReactElement, ReactNode, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next';
import AuthLayout from '@/components/common/AuthLayout';

export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-poppins',
});

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    });
  }

  return (
    <>
      <Head>
        <title>Ride-Hailing Admin Dashboard</title>
        <meta name='description' content='Ride-Hailing Admin Dashboard' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <main className={poppins.variable}>
        <QueryClientProvider client={queryClientRef.current}>
          <RecoilRoot>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: poppins.style.fontFamily,
                },
              }}
            >
              <AuthLayout>
                <Component {...pageProps} />
              </AuthLayout>
            </ConfigProvider>
          </RecoilRoot>
        </QueryClientProvider>
      </main>
    </>
  );
}
