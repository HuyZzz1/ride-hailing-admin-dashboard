import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import { loadBookings, saveBookings } from '@/utils/db';
import { logAudit } from '@/service/auditTrail';
import { ActionAudit } from '@/utils/enum';
import { BookingCollection } from '@/service/collection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      message: 'Invalid request, please provide an array of booking IDs',
    });
  }

  let bookings = loadBookings();
  const initialLength = bookings.length;

  bookings = bookings.filter((b: BookingCollection) => !ids.includes(b.id));

  if (bookings.length === initialLength) {
    return res
      .status(404)
      .json({ message: 'No matching bookings found to delete' });
  }

  saveBookings(bookings);

  ids.forEach((id) => {
    logAudit(
      ActionAudit.DELETE,
      id,
      token?.name as string,
      `Deleted booking id: ${id}`
    );
  });

  return res
    .status(200)
    .json({ message: 'Bookings deleted successfully', deletedIds: ids });
}
