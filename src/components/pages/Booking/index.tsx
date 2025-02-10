import {
  ShowErrorMessage,
  ShowSuccessMessage,
} from '@/components/common/Message';
import Table from '@/components/storybook/Table';
import {
  deleteBookingQuery,
  deleteMultipleBookingQuery,
  listBookingsQuery,
} from '@/service/api/bookings';
import { BookingCollection } from '@/service/collection';
import { PaginationRequest, PaginationResponse } from '@/service/types';
import { DEFAULT_FILTER, DEFAULT_RESPONSE } from '@/utils/constant';
import { useMutation } from '@tanstack/react-query';
import {
  Affix,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
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
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InfoOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import _debounce from 'lodash/debounce';
import { RideStatus, Role } from '@/utils/enum';
import usePagination from '@/service/hooks/usePagination';
import { useRecoilValue } from 'recoil';
import { driversRecoil } from '@/service/recoil/drivers';
import Create from './Modal/Create';
import Edit from './Modal/Edit';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ViewDetails from './Modal/ViewDetails';
import { TableRowSelection } from 'antd/es/table/interface';
import { userRecoil } from '@/service/recoil/user';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const Filter = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const drivers = useRecoilValue(driversRecoil);
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
      driverId: router.query?.driverId || null,
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
                placeholder='Enter ID, Customer Name to search...'
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
            <Form.Item name='driverId'>
              <Select
                allowClear
                className='w-full'
                placeholder='Driver'
                options={drivers.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                onChange={(value) => {
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      driverId: value,
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
  const createRef = useRef<any>(null);
  const editRef = useRef<any>(null);
  const viewDetailsRef = useRef<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const user = useRecoilValue(userRecoil);
  const queryExport = useRef<PaginationRequest>({
    ...DEFAULT_FILTER,
    limit: 9999,
  });
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteBookingQuery,
  });

  const { mutate: deleteMultipleMutate, isPending: isPendingDeleteMultiple } =
    useMutation({
      mutationFn: deleteMultipleBookingQuery,
    });

  const fetchData = () => {
    const { page, search, status, driverId, startDate, endDate } =
      router.query as any;

    query.current.filter = {};
    query.current.page = page ? Number(page) : 1;
    query.current.search = search;

    if (status) query.current.filter = { ...query.current.filter, status };
    if (driverId) query.current.filter = { ...query.current.filter, driverId };

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

  const onDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Booking',
      content: 'Are you sure you want to delete',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        deleteMutate(
          { id },
          {
            onSuccess: () => {
              fetchData();
              ShowSuccessMessage('deleteBooking');
            },
            onError: (error: any) => {
              ShowErrorMessage(error.statusText);
            },
          }
        );
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
                    viewDetailsRef.current.open(item);
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
                    editRef.current.open(item);
                  }}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
              {user?.role === Role.ADMIN && (
                <Tooltip title='Delete'>
                  <Button
                    size='small'
                    type='primary'
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(item?.id);
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
              )}
            </Space>
          );
        },
      },
    ];
  }, [user.role]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onDeleteMultiple = (ids: string[]) => {
    Modal.confirm({
      title: 'Delete Booking',
      content: 'Are you sure you want to delete',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        deleteMultipleMutate(
          { ids },
          {
            onSuccess: () => {
              fetchData();
              setSelectedRowKeys([]);
              ShowSuccessMessage('deleteBooking');
            },
            onError: (error: any) => {
              ShowErrorMessage(error.statusText);
            },
          }
        );
      },
    });
  };

  const onExport = () => {
    setIsLoadingExport(true);
    const { page, search, status, driverId, startDate, endDate } =
      router.query as any;

    queryExport.current.filter = {};
    queryExport.current.page = page ? Number(page) : 1;
    queryExport.current.search = search;

    if (status)
      queryExport.current.filter = { ...queryExport.current.filter, status };
    if (driverId)
      queryExport.current.filter = { ...queryExport.current.filter, driverId };

    if (startDate && endDate)
      queryExport.current.filter = {
        ...queryExport.current.filter,
        startDate: dayjs(startDate, 'DD/MM/YYYY').startOf('days').toDate(),
        endDate: dayjs(endDate, 'DD/MM/YYYY').endOf('days').toDate(),
      };

    mutate({ ...queryExport.current } as any, {
      onSuccess: ({ data }) => {
        const worksheet = XLSX.utils.json_to_sheet(
          data?.docs?.map((item: BookingCollection) => {
            let status = '';

            if (item?.status === RideStatus.PENDING) {
              status = 'Pending';
            } else if (item?.status === RideStatus.COMPLETED) {
              status = 'Completed';
            } else if (item?.status === RideStatus.IN_PROGRESS) {
              status = 'In Progress';
            } else {
              status = 'Cancelled';
            }

            return {
              'Booking ID': item?.id,
              'Customer Name': item?.customer,
              'Pickup Location': item?.formAddress,
              'Drop-off Location': item?.toAddress,
              'Driver Name': item?.driver,
              Status: status,
              'Created At': dayjs(item.createdAt).format('DD-MM-YYYY HH:mm'),
            };
          })
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `Booking Management.xlsx`);
        setIsLoadingExport(false);
      },
      onError: (error: any) => {
        ShowErrorMessage(error.statusText);
        setIsLoadingExport(false);
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [router.query]);

  return (
    <>
      <Create ref={createRef} />
      <Edit ref={editRef} fetchData={fetchData} />
      <ViewDetails ref={viewDetailsRef} />
      <div className='flex flex-col'>
        <Affix
          offsetTop={0}
          target={() => document.getElementById('main-layout')}
        >
          <div className='w-full h-[60px] bg-white flex items-center px-5'>
            <p className='text-lg font-medium'>Booking Management</p>
          </div>
        </Affix>

        <div className='p-3'>
          <Card>
            <Filter />
            {user.role === Role.ADMIN && (
              <div className='flex items-center justify-between mb-5 sm:flex-col-reverse sm:items-start sm:gap-3'>
                <Button
                  type='primary'
                  danger
                  onClick={() => onDeleteMultiple(selectedRowKeys as string[])}
                  disabled={!hasSelected}
                  loading={isPendingDeleteMultiple}
                  className='sm:w-full'
                >
                  <div className='flex items-center justify-center gap-2.5'>
                    <DeleteOutlined style={{ fontSize: 16 }} />
                    Delete Multiple
                  </div>
                </Button>
                <div className='flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-2 sm:w-full'>
                  <Button
                    type='primary'
                    onClick={() => createRef.current.open()}
                    className='sm:w-full'
                  >
                    <div className='flex items-center justify-center gap-2.5'>
                      <PlusOutlined style={{ color: 'white', fontSize: 16 }} />
                      Create
                    </div>
                  </Button>
                  <Button
                    type='primary'
                    onClick={onExport}
                    className='sm:w-full'
                    loading={isLoadingExport}
                  >
                    <div className='flex items-center justify-center gap-2.5'>
                      <DownloadOutlined
                        style={{ color: 'white', fontSize: 16 }}
                      />
                      Export
                    </div>
                  </Button>
                </div>
              </div>
            )}

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
              {...(user.role === Role.ADMIN && { rowSelection: rowSelection })}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Booking;
