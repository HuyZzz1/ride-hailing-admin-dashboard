import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from '../../../service/auth';

const drivers = [
  { id: '1', name: 'Trần Văn D', vehicle: 'Toyota', rating: 4.9 },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await checkAuth(req, res);
  if (!token) return;

  if (req.method === 'POST') {
    const { search, page = 1, limit = 5 } = req.body;
    let filteredDrivers = [...drivers];

    if (search) {
      filteredDrivers = filteredDrivers.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filteredDrivers.length;
    const paginatedDrivers = filteredDrivers.slice(
      (page - 1) * limit,
      page * limit
    );

    return res.status(200).json({ total, page, limit, data: paginatedDrivers });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
