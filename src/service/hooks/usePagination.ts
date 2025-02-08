import { useRouter } from 'next/router';

export default function usePagination() {
  const router = useRouter();
  const onChange = (pagination: any) => {
    if (pagination.current) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: pagination.current },
      });
    }
  };
  return { onChange };
}
