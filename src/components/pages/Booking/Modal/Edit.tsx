import {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { useForm } from 'antd/es/form/Form';
import { fieldValidate } from '@/utils/helper';
import { Button, Form, Input, Modal, Select } from 'antd';
import { RideStatus, Role } from '@/utils/enum';
import { driversRecoil } from '@/service/recoil/drivers';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import {
  ShowErrorMessage,
  ShowSuccessMessage,
} from '@/components/common/Message';
import { BookingCollection } from '@/service/collection';
import { editBookingQuery } from '@/service/api/bookings';
import { userRecoil } from '@/service/recoil/user';

const Edit: ForwardRefRenderFunction<
  any,
  {
    fetchData: () => void;
  }
> = ({ fetchData }: any, ref) => {
  const [form] = useForm();
  const [state, steState] = useState<{
    open: boolean;
    item: BookingCollection | undefined;
  }>({ open: false, item: undefined });
  const { open, item } = state;
  const { mutate, isPending } = useMutation({
    mutationFn: editBookingQuery,
  });
  const drivers = useRecoilValue(driversRecoil);
  const user = useRecoilValue(userRecoil);

  const onFinish = (values: {
    status: RideStatus;
    customer: string;
    formAddress: string;
    toAddress: string;
    driverId: string;
  }) => {
    mutate(
      { ...values, id: item?.id as string },
      {
        onSuccess: () => {
          fetchData();
          ShowSuccessMessage('editBooking');
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
    steState({ open: false, item: undefined });
  };

  useImperativeHandle(ref, () => ({
    open: (item: BookingCollection) => {
      form.setFieldsValue(item);
      steState({ open: true, item });
    },
  }));

  return (
    <Modal
      open={open}
      closable={!isPending}
      onCancel={() => !isPending && onClose()}
      footer={null}
      width={600}
      title='Edit Booking'
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
          <Input
            placeholder='Customer Name'
            disabled={user.role == Role.STAFF}
          />
        </Form.Item>
        <Form.Item
          name='formAddress'
          rules={[fieldValidate.required]}
          label='Pickup Location'
        >
          <Input
            placeholder='Pickup Location'
            disabled={user.role == Role.STAFF}
          />
        </Form.Item>
        <Form.Item
          name='toAddress'
          rules={[fieldValidate.required]}
          label='Drop-off Location'
        >
          <Input
            placeholder='Drop-off Location'
            disabled={user.role == Role.STAFF}
          />
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
            disabled={user.role == Role.STAFF}
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

export default forwardRef(Edit);
