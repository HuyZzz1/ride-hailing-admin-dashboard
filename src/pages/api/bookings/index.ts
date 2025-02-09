import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import dayjs from 'dayjs';
import { bookings } from '@/utils/mockData';
import { RideStatus } from '@/utils/enum';

export type PaginationResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type PaginationRequest = {
  filter?: {
    status?: RideStatus;
    startDate?: Date;
    endDate?: Date;
    driver?: string;
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

    let filteredBookings = [...bookings];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredBookings = filteredBookings.filter(
        (b) =>
          b.id.toLowerCase().includes(searchLower) ||
          b.customer.toLowerCase().includes(searchLower) ||
          b.driver.toLowerCase().includes(searchLower)
      );
    }

    if (filter.status) {
      filteredBookings = filteredBookings.filter(
        (b) => b.status === filter.status
      );
    }

    // if (filter.driver) {
    //   filteredBookings = filteredBookings.filter(
    //     (b) => b.driver === filter.driver
    //   );
    // }

    if (filter.startDate && filter.endDate) {
      const start = dayjs(filter.startDate).startOf('day').toDate();
      const end = dayjs(filter.endDate).endOf('day').toDate();

      filteredBookings = filteredBookings.filter((b) => {
        const bookingTime = new Date(b.createdAt);
        return bookingTime >= start && bookingTime <= end;
      });
    }

    filteredBookings.sort((a, b) => {
      const dateA = dayjs(a.createdAt);
      const dateB = dayjs(b.createdAt);

      if (sort?.field === 'createdAt' && sort.order === 'asc') {
        return dateA.isBefore(dateB) ? -1 : 1;
      }

      return dateA.isBefore(dateB) ? 1 : -1;
    });

    const totalDocs = filteredBookings.length;
    const totalPages = Math.ceil(totalDocs / currentLimit);
    const paginatedBookings = filteredBookings.slice(
      (currentPage - 1) * currentLimit,
      currentPage * currentLimit
    );

    return res.status(200).json({
      docs: paginatedBookings,
      totalDocs,
      totalPages,
      limit: currentLimit,
      page: currentPage,
    } as PaginationResponse<(typeof bookings)[0]>);
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
