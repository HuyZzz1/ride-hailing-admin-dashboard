import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';
import { auditTrail } from '@/utils/mockData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  return res.status(200).json({ docs: auditTrail });
}
