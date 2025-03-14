import type { NextApiRequest, NextApiResponse } from 'next';
import { logAudit } from '@/service/auditTrail';
import { ActionAudit } from '@/utils/enum';
import { loadBookings, saveBookings } from '@/utils/db';
import { BookingCollection } from '@/service/collection';
import { checkAuth } from '@/service/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);

  if (!token) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const bookings = await loadBookings();

  const { id } = req.body;

  const index = bookings.findIndex((b: BookingCollection) => b.id === id);
  if (index === -1)
    return res.status(404).json({ message: 'Booking not found' });

  bookings.splice(index, 1);
  await saveBookings(bookings);

  logAudit(
    ActionAudit.DELETE,
    id,
    token?.name as string,
    `Deleted booking id: ${id}`
  );

  return res.status(200).json({ message: 'Booking deleted successfully' });
}
