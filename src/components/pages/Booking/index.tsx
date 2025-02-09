import { ShowErrorMessage } from '@/components/common/Message';
import Table from '@/components/storybook/Table';
import { listBookingsQuery } from '@/service/api/bookings';
import { BookingCollection } from '@/service/collection';
import { PaginationRequest, PaginationResponse } from '@/service/types';
import { DEFAULT_FILTER, DEFAULT_RESPONSE } from '@/utils/constant';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, InfoOutlined } from '@ant-design/icons';
import _debounce from 'lodash/debounce';
import { RideStatus } from '@/utils/enum';
import usePagination from '@/service/hooks/usePagination';

const { RangePicker } = DatePicker;

const Filter = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const onChangeKeyWord = _debounce((e) => {
    const value = e.target.value.trim();

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: value,
      },
    });
  }, 1000);

  useEffect(() => {
    form.setFieldsValue({
      search: router.query?.search || '',
      status: router.query?.status || null,
      dateRange:
        router.query?.startDate && router.query?.endDate
          ? [
              dayjs(String(router.query?.startDate), 'DD/MM/YYYY'),
              dayjs(String(router.query?.endDate), 'DD/MM/YYYY'),
            ]
          : [],
    });
  }, [router.query]);

  return (
    <div className='w-full'>
      <Form layout='horizontal' form={form} className='w-full'>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name='search' style={{ margin: 0 }}>
              <Input
                placeholder='Enter ID, Customer Name, Driver Name to search...'
                onChange={onChangeKeyWord}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name='status' style={{ margin: 0 }}>
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
                onChange={(value) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      status: value,
                    },
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name='dateRange' style={{ margin: 0 }}>
              <RangePicker
                allowClear={true}
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                onChange={(dates: any) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      startDate: dates ? dates[0].format('DD/MM/YYYY') : '',
                      endDate: dates ? dates[1].format('DD/MM/YYYY') : '',
                    },
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item name='driver'>
              <Select
                allowClear
                className='w-full'
                placeholder='Driver'
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
                onChange={(value) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      status: value,
                    },
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const Booking = () => {
  const router = useRouter();
  const query = useRef<PaginationRequest>({ ...DEFAULT_FILTER });
  const { mutate, isPending } = useMutation({
    mutationFn: listBookingsQuery,
  });
  const [data, setData] =
    useState<PaginationResponse<BookingCollection>>(DEFAULT_RESPONSE);
  const { onChange } = usePagination();

  const fetchData = () => {
    const { page, search, status, startDate, endDate } = router.query as any;

    query.current.filter = {};
    query.current.page = page ? Number(page) : 1;
    query.current.search = search;

    if (status) query.current.filter = { ...query.current.filter, status };

    if (startDate && endDate)
      query.current.filter = {
        ...query.current.filter,
        startDate: dayjs(startDate, 'DD/MM/YYYY').startOf('days').toDate(),
        endDate: dayjs(endDate, 'DD/MM/YYYY').endOf('days').toDate(),
      };

    mutate({ ...query.current } as any, {
      onSuccess: ({ data }) => {
        setData(data);
      },
      onError: (error: any) => {
        ShowErrorMessage(error?.response);
      },
    });
  };

  const columns: ColumnsType<BookingCollection> = useMemo(() => {
    return [
      {
        title: 'Booking ID',
        key: 'id',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: 'Customer Name',
        key: 'customer',
        dataIndex: 'customer',
      },
      {
        title: 'Pickup Location',
        key: 'formAddress',
        dataIndex: 'formAddress',
      },
      {
        title: 'Drop-off Location',
        key: 'toAddress',
        dataIndex: 'toAddress',
      },
      {
        title: 'Driver Name',
        key: 'driverName',
        dataIndex: 'driver',
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (value) => {
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
        },
      },
      {
        title: 'Created At',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (value) => dayjs(value).format('DD-MM-YYYY HH:mm'),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        align: 'center',
        render: (item) => {
          return (
            <Space>
              <Tooltip title='View Details'>
                <Button
                  size='small'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <InfoOutlined />
                </Button>
              </Tooltip>
              <Tooltip title='Edit'>
                <Button
                  size='small'
                  type='primary'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
              <Tooltip title='Delete'>
                <Button
                  size='small'
                  type='primary'
                  danger
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Space>
          );
        },
      },
    ];
  }, []);

  useEffect(() => {
    fetchData();
  }, [router.query]);

  return (
    <div className='flex flex-col'>
      <div className='w-full h-[60px] bg-white flex items-center px-5'>
        <p className='text-lg font-medium'>Booking Management</p>
      </div>
      <div className='p-3'>
        <Card>
          <Filter />
          <div className='flex items-center justify-end mb-5'>
            <Button type='primary'>Create</Button>
          </div>
          <Table
            isLoading={isPending}
            columns={columns}
            dataSource={data.docs}
            onChange={onChange}
            pagination={{
              pageSize: data.limit,
              position: ['bottomCenter'],
              total: data.totalDocs,
              current: data.page,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Booking;
