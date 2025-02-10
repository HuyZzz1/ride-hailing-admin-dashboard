import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/bookings';
import { NextApiRequest, NextApiResponse } from 'next';
import { loadBookings } from '@/utils/db';

jest.mock('@/utils/db', () => ({
  loadBookings: jest.fn(),
  loadDrivers: jest.fn(() =>
    Promise.resolve([{ id: 'driver-123', name: 'Test Driver' }])
  ),
}));

jest.mock('@/service/auth', () => ({
  checkAuth: jest.fn(() => Promise.resolve({ name: 'Test User' })),
}));

describe('API - Bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated bookings', async () => {
    (loadBookings as jest.Mock).mockResolvedValue([
      {
        id: '1',
        customer: 'John Doe',
        driverId: 'driver-123',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    ]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { page: 1, limit: 10 },
    });

    await handler(req, res);

    if (res._getStatusCode() !== 200) {
      console.error('API Response:', res._getData());
    }

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('docs');
  });

  it('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toHaveProperty(
      'message',
      'Method Not Allowed'
    );
  });
});
