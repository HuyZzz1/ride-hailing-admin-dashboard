import LoaderComponent from '@/components/common/LoaderComponent';
import { Table } from 'antd';

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
          <div className='text-center py-5'>
            <p>No data</p>
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
