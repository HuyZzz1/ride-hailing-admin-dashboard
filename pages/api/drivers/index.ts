import type { NextApiRequest, NextApiResponse } from 'next';
import { DriverStatus } from '@/utils/enum';
import { loadDrivers } from '@/utils/db';
import { DriverCollection } from '@/service/collection';
import { checkAuth } from '@/service/auth';

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

    let filteredDrivers = (await loadDrivers()) as any;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDrivers = filteredDrivers.filter((b: DriverCollection) =>
        b.name.toLowerCase().includes(searchLower)
      );
    }

    if (filter.status) {
      filteredDrivers = filteredDrivers.filter(
        (b: DriverCollection) => b.status === filter.status
      );
    }

    const totalDocs = filteredDrivers.length;
    const totalPages = Math.ceil(totalDocs / currentLimit);
    const paginatedDrivers = filteredDrivers.slice(
      (currentPage - 1) * currentLimit,
      currentPage * currentLimit
    );

    return res.status(200).json({
      docs: paginatedDrivers,
      totalDocs,
      totalPages,
      limit: currentLimit,
      page: currentPage,
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
