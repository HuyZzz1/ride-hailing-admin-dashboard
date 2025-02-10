import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/bookings/create';
import { NextApiRequest, NextApiResponse } from 'next';
import { loadBookings } from '@/utils/db';
import { logAudit } from '@/service/auditTrail';

jest.mock('@/utils/db', () => ({
  loadBookings: jest.fn(),
  saveBookings: jest.fn(),
  loadAuditTrail: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@/service/auditTrail', () => ({
  logAudit: jest.fn(),
}));

describe('API - Create Booking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new booking', async () => {
    (loadBookings as jest.Mock).mockResolvedValue([]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        customer: 'Jane Doe',
        formAddress: 'A',
        toAddress: 'B',
        driverId: 'driver-456',
        status: 'PENDING',
      },
    });

    await handler(req, res);

    console.log('API Response:', res._getData());

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty('booking');

    expect(logAudit).toHaveBeenCalled();
  });
});
