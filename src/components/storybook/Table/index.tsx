import LoaderComponent from '@/components/common/LoaderComponent';
import { Empty, Table } from 'antd';

type Props = {
  pagination?: any;
  dataSource: any[];
  isLoading?: boolean;
  columns: any[];
  onChange?: any;
  [x: string]: any;
  scroll?: any;
};

const CustomTable: React.FC<Props> = ({
  columns,
  dataSource,
  pagination,
  isLoading,
  onChange,
  scroll = { x: 768 },
  ...rest
}) => {
  return (
    <Table
      size='small'
      columns={columns}
      locale={{
        emptyText: isLoading ? (
          <div className='py-5'>
            <LoaderComponent />
          </div>
        ) : (
          <div className='py-5'>
            <Empty />
          </div>
        ),
      }}
      pagination={
        !pagination || pagination?.total <= pagination?.pageSize
          ? false
          : pagination
      }
      dataSource={dataSource}
      {...(onChange && { onChange: onChange })}
      {...rest}
      scroll={scroll}
    />
  );
};

export default CustomTable;
