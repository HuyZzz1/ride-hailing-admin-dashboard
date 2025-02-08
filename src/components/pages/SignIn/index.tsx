import { fieldValidate } from '@/utils/helper';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { PAGE_ROUTES } from '@/utils/routes';
import {
  ShowErrorMessage,
  ShowSuccessMessage,
} from '@/components/common/Message';
import { useSetRecoilState } from 'recoil';
import { userRecoil } from '@/service/recoil/user';

const SignIn = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userRecoil);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      ShowErrorMessage(result?.error);
    } else {
      setUser((prev) => ({ ...prev, refreshUser: true }));
      router.push(PAGE_ROUTES.BOOKING);

      ShowSuccessMessage('login');

      router.push(PAGE_ROUTES.BOOKING);
    }

    setLoading(false);
  };

  return (
    <div className='w-full h-screen bg-gradient-to-r from-violet-200 to-violet-500 flex items-center justify-center'>
      <div className='p-5 border-1 border-white shadow-xl rounded-lg bg-white w-[31.25rem] flex flex-col items-center justify-center gap-5'>
        <h1 className=' text-4xl uppercase font-bold text-violet-500'>
          MOOVTEK
        </h1>

        <Form
          layout='vertical'
          form={form}
          onFinish={onFinish}
          className='w-full'
        >
          <Form.Item
            name='email'
            label='Email'
            rules={[fieldValidate.required]}
          >
            <Input placeholder='Enter email' size='large' />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[fieldValidate.required]}
          >
            <Input.Password placeholder='Enter password' size='large' />
          </Form.Item>
          <Form.Item>
            <Button
              className='w-full mt-2.5'
              htmlType='submit'
              type='primary'
              size='large'
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
