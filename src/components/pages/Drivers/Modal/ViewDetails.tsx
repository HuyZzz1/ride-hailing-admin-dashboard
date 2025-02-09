import {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react';
import { useForm } from 'antd/es/form/Form';
import { DriverCollection } from '@/service/collection';
import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsProps,
  List,
  Modal,
  Rate,
} from 'antd';

const ViewDetails: ForwardRefRenderFunction<any> = ({}, ref) => {
  const [form] = useForm();
  const [state, steState] = useState<{
    open: boolean;
    item: DriverCollection | undefined;
  }>({ open: false, item: undefined });
  const { open, item } = state;

  const onClose = () => {
    form.resetFields();
    steState({ open: false, item: undefined });
  };

  useImperativeHandle(ref, () => ({
    open: (item: DriverCollection) => {
      steState({ open: true, item });
    },
  }));

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Name',
      children: item?.name,
    },
    {
      key: '2',
      label: 'Birthday',
      children: item?.birthday,
    },
    {
      key: '3',
      label: 'Phone Number',
      children: item?.phone,
    },
    {
      key: '4',
      label: 'Address',
      children: item?.address,
    },

    {
      key: '8',
      label: 'Vehicle',
      children: item?.vehicle,
    },
    {
      key: '9',
      label: 'License Plate',
      children: item?.licensePlate,
    },
    {
      key: '6',
      label: 'Completed Rides',
      children: item?.completedRides,
      span: 2,
    },
    {
      key: '7',
      label: 'Rating',
      children: item?.rating,
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
      <div className='flex flex-col gap-5 pt-5'>
        <Card>
          <Descriptions title='Info' layout='vertical' items={items} />
        </Card>
        <Card>
          <h1 className='text-[16px] font-semibold'>Reviews</h1>

          <List
            itemLayout='vertical'
            size='large'
            pagination={false}
            dataSource={item?.review}
            footer={false}
            renderItem={(item, index) => (
              <List.Item
                key={item.title}
                actions={[
                  <Rate
                    disabled
                    value={item?.rating}
                    key='list-vertical-star-o'
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={item?.customer}
                />
                {item.title}
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default forwardRef(ViewDetails);
