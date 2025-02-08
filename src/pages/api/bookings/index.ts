import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';

const bookings = [
  {
    id: '1',
    customer: 'Nguyễn Văn A',
    driver: 'Trần B',
    status: 'Pending',
    date: '2024-02-01',
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method === 'POST') {
    const { search, status, page = 1, limit = 5 } = req.body;
    let filteredBookings = [...bookings];

    if (search) {
      filteredBookings = filteredBookings.filter((b) =>
        b.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredBookings = filteredBookings.filter((b) => b.status === status);
    }

    const total = filteredBookings.length;
    const paginatedBookings = filteredBookings.slice(
      (page - 1) * limit,
      page * limit
    );

    return res
      .status(200)
      .json({ total, page, limit, data: paginatedBookings });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
