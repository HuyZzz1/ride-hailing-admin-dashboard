import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function checkAuth(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' });
  }

  return token;
}
