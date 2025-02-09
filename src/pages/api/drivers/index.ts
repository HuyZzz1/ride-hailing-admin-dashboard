import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import { diversData } from '@/utils/mockData';
import { DriverStatus } from '@/utils/enum';

export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type PaginationRequest = {
  filter?: {
    status?: DriverStatus;
  };
  search?: string;
  sort?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  page?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method === 'POST') {
    const {
      search = '',
      filter = {},
      page,
      limit,
    }: PaginationRequest = req.body;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 18;

    let filteredDivers = [...diversData];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDivers = filteredDivers.filter((b) =>
        b.name.toLowerCase().includes(searchLower)
      );
    }

    if (filter.status) {
      filteredDivers = filteredDivers.filter((b) => b.status === filter.status);
    }

    const totalDocs = filteredDivers.length;
    const totalPages = Math.ceil(totalDocs / currentLimit);
    const paginatedBookings = filteredDivers.slice(
      (currentPage - 1) * currentLimit,
      currentPage * currentLimit
    );

    return res.status(200).json({
      docs: paginatedBookings,
      totalDocs,
      totalPages,
      limit: currentLimit,
      page: currentPage,
    } as PaginationResponse<(typeof diversData)[0]>);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
