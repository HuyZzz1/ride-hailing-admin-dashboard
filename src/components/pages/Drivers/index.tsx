import { ShowErrorMessage } from '@/components/common/Message';
import Table from '@/components/storybook/Table';
import { DriverCollection } from '@/service/collection';
import { PaginationRequest, PaginationResponse } from '@/service/types';
import { DEFAULT_FILTER, DEFAULT_RESPONSE } from '@/utils/constant';
import { useMutation } from '@tanstack/react-query';
import {
  Affix,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InfoOutlined } from '@ant-design/icons';
import _debounce from 'lodash/debounce';
import { DriverStatus } from '@/utils/enum';
import usePagination from '@/service/hooks/usePagination';
import { listDriversQuery } from '@/service/api/drivers';
import ViewDetails from './Modal/ViewDetails';

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
    });
  }, [router.query]);

  return (
    <div className='w-full mb-5'>
      <Form layout='horizontal' form={form} className='w-full'>
        <Row gutter={[12, 12]}>
          <Col sm={24} md={12} xl={7}>
            <Form.Item name='search' style={{ margin: 0 }}>
              <Input
                placeholder='Enter name to search...'
                onChange={onChangeKeyWord}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col sm={24} md={12} xl={7}>
            <Form.Item name='status' style={{ margin: 0 }}>
              <Select
                allowClear
                className='w-full'
                placeholder='Status'
                options={[
                  {
                    label: 'Active',
                    value: DriverStatus.ACTIVE,
                  },
                  {
                    label: 'Deactivated',
                    value: DriverStatus.DEACTIVATED,
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

const Drivers = () => {
  const router = useRouter();
  const query = useRef<PaginationRequest>({ ...DEFAULT_FILTER });
  const { mutate, isPending } = useMutation({
    mutationFn: listDriversQuery,
  });
  const [data, setData] =
    useState<PaginationResponse<DriverCollection>>(DEFAULT_RESPONSE);
  const { onChange } = usePagination();
  const viewDetailsRef = useRef<any>(null);

  const fetchData = () => {
    const { page, search, status } = router.query as any;

    query.current.filter = {};
    query.current.page = page ? Number(page) : 1;
    query.current.search = search;

    if (status) query.current.filter = { ...query.current.filter, status };

    mutate({ ...query.current } as any, {
      onSuccess: ({ data }) => {
        setData(data);
      },
      onError: (error: any) => {
        ShowErrorMessage(error?.response);
      },
    });
  };

  const columns: ColumnsType<DriverCollection> = useMemo(() => {
    return [
      {
        title: 'Name',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Birthday',
        key: 'birthday',
        dataIndex: 'birthday',
      },
      {
        title: 'Phone Number',
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        title: 'Address',
        key: 'address',
        dataIndex: 'address',
      },
      {
        title: 'Status',
        key: 'status',
        align: 'center',
        dataIndex: 'status',
        render: (value) => {
          switch (value) {
            case DriverStatus.ACTIVE:
              return <Tag color='green'>Active</Tag>;
            default:
              return <Tag color='red'>Deactivated</Tag>;
          }
        },
      },
      {
        title: '',
        key: 'actions',
        width: 60,
        align: 'center',
        render: (item) => {
          return (
            <Space>
              <Tooltip title='View Details'>
                <Button
                  type='primary'
                  size='small'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    viewDetailsRef.current.open(item);
                  }}
                >
                  <InfoOutlined />
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
    <>
      <ViewDetails ref={viewDetailsRef} />

      <div className='flex flex-col'>
        <Affix
          offsetTop={0}
          target={() => document.getElementById('main-layout')}
        >
          <div className='w-full h-[60px] bg-white flex items-center px-5'>
            <p className='text-lg font-medium'>Driver Management</p>
          </div>
        </Affix>

        <div className='p-3'>
          <Card>
            <Filter />
            <Table
              isLoading={isPending}
              className='row-cursor'
              columns={columns}
              dataSource={data.docs}
              onChange={onChange}
              pagination={{
                pageSize: data.limit,
                position: ['bottomCenter'],
                total: data.totalDocs,
                current: data.page,
              }}
              onRow={(record: DriverCollection) => {
                return {
                  onClick: () => {
                    viewDetailsRef.current.open(record);
                  },
                };
              }}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Drivers;
