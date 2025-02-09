import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import { logAudit } from '@/service/auditTrail';
import { ActionAudit } from '@/utils/enum';
import { loadBookings, saveBookings } from '@/utils/db';
import { BookingCollection } from '@/service/collection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);

  if (!token) return;

  if (req.method === 'PUT') {
    const bookings = loadBookings();
    const { id, customer, formAddress, toAddress, driverId, status } = req.body;

    const bookingIndex = bookings.findIndex(
      (b: BookingCollection) => String(b.id) === String(id)
    );
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      customer,
      formAddress,
      toAddress,
      driverId,
      status,
    };
    saveBookings(bookings);

    logAudit(
      ActionAudit.UPDATE,
      id,
      token?.name as string,
      `Updated booking id: ${id}`
    );

    return res.status(200).json({
      message: 'Booking updated successfully',
      booking: bookings[bookingIndex],
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
