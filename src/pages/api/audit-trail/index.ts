import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import dayjs from 'dayjs';
import { loadAuditTrail } from '@/utils/db';
import { AuditTrailCollection } from '@/service/collection';

export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type PaginationRequest = {
  filter?: {
    startDate?: Date;
    endDate?: Date;
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
      sort,
      page,
      limit,
    }: PaginationRequest = req.body;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 18;

    let filteredAuditTrail = await loadAuditTrail();

    if (search) {
      const searchLower = search.toLowerCase();
      filteredAuditTrail = filteredAuditTrail.filter(
        (b: AuditTrailCollection) =>
          b.user.toLowerCase().includes(searchLower) ||
          b.details.toLowerCase().includes(searchLower)
      );
    }

    if (filter.startDate && filter.endDate) {
      const start = dayjs(filter.startDate).startOf('day').toDate();
      const end = dayjs(filter.endDate).endOf('day').toDate();

      filteredAuditTrail = filteredAuditTrail.filter(
        (b: AuditTrailCollection) => {
          const bookingTime = new Date(b.createdAt);
          return bookingTime >= start && bookingTime <= end;
        }
      );
    }

    filteredAuditTrail.sort((a: any, b: any) => {
      const dateA = dayjs(a.createdAt);
      const dateB = dayjs(b.createdAt);

      if (sort?.field === 'createdAt' && sort.order === 'asc') {
        return dateA.isBefore(dateB) ? -1 : 1;
      }

      return dateA.isBefore(dateB) ? 1 : -1;
    });

    const totalDocs = filteredAuditTrail.length;
    const totalPages = Math.ceil(totalDocs / currentLimit);
    const paginatedAuditTrail = filteredAuditTrail.slice(
      (currentPage - 1) * currentLimit,
      currentPage * currentLimit
    );

    return res.status(200).json({
      docs: paginatedAuditTrail,
      totalDocs,
      totalPages,
      limit: currentLimit,
      page: currentPage,
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
