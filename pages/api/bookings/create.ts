import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { logAudit } from '@/service/auditTrail';
import { ActionAudit } from '@/utils/enum';
import { loadBookings, saveBookings } from '@/utils/db';
import { checkAuth } from '@/service/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method === 'POST') {
    const bookings = await loadBookings();

    console.log('bookings:', bookings);

    const { customer, formAddress, toAddress, driverId, status } = req.body;

    if (!customer || !formAddress || !toAddress || !driverId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBooking = {
      id: uuidv4().split('-')[0],
      customer,
      formAddress,
      toAddress,
      driverId,
      status,
      createdAt: new Date(),
    };

    bookings.push(newBooking);
    await saveBookings(bookings);
    console.log('Booking saved successfully');

    logAudit(
      ActionAudit.CREATE,
      newBooking.id,
      token?.name as string,
      `Created booking for ${customer}`
    );

    return res
      .status(201)
      .json({ message: 'Booking created successfully', booking: newBooking });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
