import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { RideStatus } from '@/utils/enum';
import { loadBookings, loadDrivers } from '@/utils/db';
import { BookingCollection, DriverCollection } from '@/service/collection';
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
    status?: RideStatus;
    startDate?: Date;
    endDate?: Date;
    driverId?: string;
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
  try {
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

      let filteredBookings = await loadBookings();
      const diversData = (await loadDrivers()) as any;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredBookings = filteredBookings.filter(
          (b: BookingCollection) =>
            b.id.toLowerCase().includes(searchLower) ||
            b.customer.toLowerCase().includes(searchLower) ||
            b?.driver?.toLowerCase().includes(searchLower)
        );
      }

      if (filter.status) {
        filteredBookings = filteredBookings.filter(
          (b: BookingCollection) => b.status === filter.status
        );
      }

      if (filter.driverId) {
        filteredBookings = filteredBookings.filter(
          (b: BookingCollection) => b.driverId === filter.driverId
        );
      }

      if (filter.startDate && filter.endDate) {
        const start = dayjs(filter.startDate).startOf('day').toDate();
        const end = dayjs(filter.endDate).endOf('day').toDate();

        filteredBookings = filteredBookings.filter((b: BookingCollection) => {
          const bookingTime = new Date(b.createdAt);
          return bookingTime >= start && bookingTime <= end;
        });
      }

      filteredBookings.sort((a: any, b: any) => {
        const dateA = dayjs(a.createdAt);
        const dateB = dayjs(b.createdAt);

        if (sort?.field === 'createdAt' && sort.order === 'asc') {
          return dateA.isBefore(dateB) ? -1 : 1;
        }

        return dateA.isBefore(dateB) ? 1 : -1;
      });

      const enrichedBookings = filteredBookings.map(
        (booking: BookingCollection) => {
          const driverInfo =
            diversData.find(
              (driver: DriverCollection) => driver.id === booking.driverId
            )?.name || null;
          return {
            ...booking,
            driver: driverInfo,
          };
        }
      );

      const totalDocs = enrichedBookings.length;
      const totalPages = Math.ceil(totalDocs / currentLimit);
      const paginatedBookings = enrichedBookings.slice(
        (currentPage - 1) * currentLimit,
        currentPage * currentLimit
      );

      return res.status(200).json({
        docs: paginatedBookings,
        totalDocs,
        totalPages,
        limit: currentLimit,
        page: currentPage,
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
}
