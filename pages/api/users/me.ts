import { checkAuth } from '@/service/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  return res.status(200).json({
    data: {
      id: token.sub,
      email: token.email,
      name: token.name,
      role: token.role,
    },
  });
}
