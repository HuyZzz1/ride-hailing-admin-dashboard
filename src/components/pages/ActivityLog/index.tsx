import { ShowErrorMessage } from '@/components/common/Message';
import Table from '@/components/storybook/Table';
import { AuditTrailCollection, BookingCollection } from '@/service/collection';
import { PaginationRequest, PaginationResponse } from '@/service/types';
import { DEFAULT_FILTER, DEFAULT_RESPONSE } from '@/utils/constant';
import { useMutation } from '@tanstack/react-query';
import { Affix, Card, Col, DatePicker, Form, Input, Row, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import usePagination from '@/service/hooks/usePagination';
import { listActivityLogQuery } from '@/service/api/auditTrail';
import { ActionAudit } from '@/utils/enum';

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
                placeholder='Enter user name or content to search...'
                onChange={onChangeKeyWord}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Form.Item name='dateRange'>
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
        </Row>
      </Form>
    </div>
  );
};

const ActivityLog = () => {
  const router = useRouter();
  const query = useRef<PaginationRequest>({ ...DEFAULT_FILTER });
  const { mutate, isPending } = useMutation({
    mutationFn: listActivityLogQuery,
  });
  const [data, setData] =
    useState<PaginationResponse<AuditTrailCollection>>(DEFAULT_RESPONSE);
  const { onChange } = usePagination();

  const fetchData = () => {
    const { page, search, startDate, endDate } = router.query as any;

    query.current.filter = {};
    query.current.page = page ? Number(page) : 1;
    query.current.search = search;

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
        ShowErrorMessage(error.statusText);
      },
    });
  };

  const columns: ColumnsType<BookingCollection> = useMemo(() => {
    return [
      {
        title: 'User Name',
        key: 'user',
        dataIndex: 'user',
      },
      {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        render: (value) => {
          switch (value) {
            case ActionAudit.CREATE:
              return <Tag color='green'>Create</Tag>;
            case ActionAudit.UPDATE:
              return <Tag color='blue'>Edit</Tag>;
            default:
              return <Tag color='red'>Delete</Tag>;
          }
        },
      },
      {
        title: 'Content',
        key: 'details',
        dataIndex: 'details',
      },
      {
        title: 'Time',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (value) => dayjs(value).format('DD-MM-YYYY HH:mm'),
      },
    ];
  }, []);

  useEffect(() => {
    fetchData();
  }, [router.query]);

  return (
    <>
      <div className='flex flex-col'>
        <Affix
          offsetTop={0}
          target={() => document.getElementById('main-layout')}
        >
          <div className='w-full h-[60px] bg-white flex items-center px-5'>
            <p className='text-lg font-medium'>Activity Log</p>
          </div>
        </Affix>

        <div className='p-3'>
          <Card>
            <Filter />
            <Table
              isLoading={isPending}
              columns={columns}
              dataSource={data.docs.map((a) => ({ ...a, key: a.id }))}
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
    </>
  );
};

export default ActivityLog;
