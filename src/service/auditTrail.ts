import { ActionAudit } from '@/utils/enum';
import { auditTrail } from '@/utils/mockData';
import { v4 as uuidv4 } from 'uuid';

export function logAudit(
  action: ActionAudit,
  bookingId: string,
  user: string,
  details: string
) {
  auditTrail.push({
    id: uuidv4().replace(/-/g, '').substring(0, 10),
    action,
    bookingId,
    user,
    createdAt: new Date(),
    details,
  });
}
