import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/drivers';
import { NextApiRequest, NextApiResponse } from 'next';
import { loadDrivers } from '@/utils/db';

jest.mock('@/utils/db', () => ({
  loadDrivers: jest.fn(),
}));

describe('API - Drivers', () => {
  beforeEach(() => {
    (loadDrivers as jest.Mock).mockResolvedValue([
      {
        id: 'driver-1',
        name: 'John Doe',
        status: 'ACTIVE',
      },
      {
        id: 'driver-2',
        name: 'Jane Smith',
        status: 'INACTIVE',
      },
    ]);
  });

  it('should return paginated drivers', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { page: 1, limit: 10, search: 'John' },
    });

    await handler(req, res);

    console.log('📌 Response status:', res._getStatusCode());
    console.log('📌 Response data:', res._getData());

    expect(res._getStatusCode()).toBe(200);

    const responseData = JSON.parse(res._getData());
    expect(responseData.docs).toHaveLength(1);
    expect(responseData.docs[0]).toHaveProperty('name', 'John Doe');
  });
});
