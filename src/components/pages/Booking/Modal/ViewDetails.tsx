import {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { useForm } from 'antd/es/form/Form';
import { BookingCollection } from '@/service/collection';
import { Card, Descriptions, DescriptionsProps, Modal, Tag } from 'antd';
import { RideStatus } from '@/utils/enum';
import dayjs from 'dayjs';

const ViewDetails: ForwardRefRenderFunction<any> = ({}, ref) => {
  const [form] = useForm();
  const [state, steState] = useState<{
    open: boolean;
    item: BookingCollection | undefined;
  }>({ open: false, item: undefined });
  const { open, item } = state;

  const onClose = () => {
    form.resetFields();
    steState({ open: false, item: undefined });
  };

  useImperativeHandle(ref, () => ({
    open: (item: BookingCollection) => {
      steState({ open: true, item });
    },
  }));

  const getStatus = (value: RideStatus) => {
    switch (value) {
      case RideStatus.PENDING:
        return <Tag color='gray'>Pending</Tag>;
      case RideStatus.COMPLETED:
        return <Tag color='green'>Completed</Tag>;
      case RideStatus.IN_PROGRESS:
        return <Tag color='blue'>In Progress</Tag>;
      default:
        return <Tag color='red'>Cancelled</Tag>;
    }
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Booking ID',
      children: item?.id,
    },
    {
      key: '2',
      label: 'Customer Name',
      children: item?.customer,
    },
    {
      key: '3',
      label: 'Pickup Location',
      children: item?.formAddress,
    },
    {
      key: '5',
      label: 'Driver Name',
      children: item?.driver,
    },
    {
      key: '4',
      label: 'Drop-off Location',
      children: item?.toAddress,
    },
    {
      key: '6',
      label: 'Status',
      children: getStatus(item?.status as RideStatus),
    },
    {
      key: '7',
      label: 'Created At',
      children: dayjs(item?.createdAt).format('DD-MM-YYYY HH:mm'),
    },
  ];

  return (
    <Modal
      open={open}
      closable
      onCancel={onClose}
      footer={null}
      width={1200}
      title='View Details'
    >
      <div className='pt-5'>
        <Card>
          <Descriptions layout='vertical' items={items} />
        </Card>
      </div>
    </Modal>
  );
};

export default forwardRef(ViewDetails);
