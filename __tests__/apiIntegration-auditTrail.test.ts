import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/audit-trail';
import { NextApiRequest, NextApiResponse } from 'next';
import { loadAuditTrail } from '@/utils/db';

jest.mock('@/utils/db', () => ({
  loadAuditTrail: jest.fn(),
}));

describe('API - Audit Trail', () => {
  beforeEach(() => {
    (loadAuditTrail as jest.Mock).mockResolvedValue([
      {
        id: 'audit-1',
        user: 'Alice',
        details: 'Updated booking',
        createdAt: new Date('2024-02-01T10:00:00Z'),
      },
      {
        id: 'audit-2',
        user: 'Bob',
        details: 'Deleted booking',
        createdAt: new Date('2024-02-02T12:00:00Z'),
      },
    ]);
  });

  it('should return paginated audit trails', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { page: 1, limit: 10, search: 'Alice' },
    });

    await handler(req, res);

    console.log('📌 Response status:', res._getStatusCode());
    console.log('📌 Response data:', res._getData());

    expect(res._getStatusCode()).toBe(200);

    const responseData = JSON.parse(res._getData());
    expect(responseData.docs).toHaveLength(1);
    expect(responseData.docs[0]).toHaveProperty('user', 'Alice');
  });

  it('should filter audit trails by date range', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        page: 1,
        limit: 10,
        filter: {
          startDate: '2024-02-01',
          endDate: '2024-02-01',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const responseData = JSON.parse(res._getData());
    expect(responseData.docs).toHaveLength(1);
    expect(responseData.docs[0]).toHaveProperty('user', 'Alice');
  });
});
