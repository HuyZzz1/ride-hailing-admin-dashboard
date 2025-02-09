import { loadAuditTrail, saveAuditTrail } from '@/utils/db';
import { ActionAudit } from '@/utils/enum';
import { v4 as uuidv4 } from 'uuid';

export function logAudit(
  action: ActionAudit,
  bookingId: string,
  user: string,
  details: string
) {
  const auditTrail = loadAuditTrail();
  auditTrail.push({
    id: uuidv4().split('-')[0],
    action,
    bookingId,
    user,
    createdAt: new Date(),
    details,
  });
  saveAuditTrail(auditTrail);
}
