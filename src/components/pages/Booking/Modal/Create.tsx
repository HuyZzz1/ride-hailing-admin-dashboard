import {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { useForm } from 'antd/es/form/Form';
import { useRouter } from 'next/router';
import { fieldValidate } from '@/utils/helper';
import { Button, Form, Input, Modal, Select } from 'antd';
import { RideStatus } from '@/utils/enum';
import { driversRecoil } from '@/service/recoil/drivers';
import { useRecoilValue } from 'recoil';
import { createBookingQuery } from '@/service/api/bookings';
import { useMutation } from '@tanstack/react-query';
import {
  ShowErrorMessage,
  ShowSuccessMessage,
} from '@/components/common/Message';

const Create: ForwardRefRenderFunction<any> = ({}, ref) => {
  const router = useRouter();
  const [form] = useForm();
  const [state, steState] = useState<{
    open: boolean;
  }>({ open: false });
  const { open } = state;
  const { mutate, isPending } = useMutation({
    mutationFn: createBookingQuery,
  });
  const drivers = useRecoilValue(driversRecoil);

  const onFinish = (values: {
    status: RideStatus;
    customer: string;
    formAddress: string;
    toAddress: string;
    driverId: string;
  }) => {
    mutate(
      { ...values },
      {
        onSuccess: () => {
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              page: 1,
            },
          });

          ShowSuccessMessage('createBooking');
          onClose();
        },
        onError: (error: any) => {
          ShowErrorMessage(error.statusText);
        },
      }
    );
  };

  const onClose = () => {
    form.resetFields();
    steState({ open: false });
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      form.setFieldValue('status', RideStatus.PENDING);
      steState({ open: true });
    },
  }));

  return (
    <Modal
      open={open}
      closable={!isPending}
      onCancel={() => !isPending && onClose()}
      footer={null}
      width={600}
      title='Create Booking'
    >
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item
          name='status'
          rules={[fieldValidate.required]}
          label='Status'
        >
          <Select
            allowClear
            className='w-full'
            placeholder='Status'
            options={[
              {
                label: 'Pending',
                value: RideStatus.PENDING,
              },
              {
                label: 'Completed',
                value: RideStatus.COMPLETED,
              },
              {
                label: 'In Progress',
                value: RideStatus.IN_PROGRESS,
              },
              {
                label: 'Cancelled',
                value: RideStatus.CANCELLED,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name='customer'
          rules={[fieldValidate.required]}
          label='Customer Name'
        >
          <Input placeholder='Customer Name' />
        </Form.Item>
        <Form.Item
          name='formAddress'
          rules={[fieldValidate.required]}
          label='Pickup Location'
        >
          <Input placeholder='Pickup Location' />
        </Form.Item>
        <Form.Item
          name='toAddress'
          rules={[fieldValidate.required]}
          label='Drop-off Location'
        >
          <Input placeholder='Drop-off Location' />
        </Form.Item>
        <Form.Item
          name='driverId'
          rules={[fieldValidate.required]}
          label='Driver'
        >
          <Select
            allowClear
            className='w-full'
            placeholder='Driver'
            options={drivers.map((item) => ({
              label: item?.name,
              value: item?.id,
            }))}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            return (
              <div className='flex gap-2 w-full justify-center mt-5'>
                <Button
                  type='primary'
                  loading={isPending}
                  className='w-[120px]'
                  htmlType='submit'
                  disabled={
                    !form.isFieldsTouched([], true) ||
                    form
                      .getFieldsError()
                      .some(({ errors }) => errors.length > 0)
                  }
                >
                  Save
                </Button>
                <Button
                  onClick={onClose}
                  className='w-[120px]'
                  disabled={isPending}
                >
                  Close
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(Create);
