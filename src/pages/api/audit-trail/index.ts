import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';

const auditLogs = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method === 'POST') {
    const { user, action } = req.body;
    auditLogs.unshift({ user, action, timestamp: new Date().toISOString() });
    return res.status(201).json({ message: 'Logged successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
