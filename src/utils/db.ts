import fs from 'fs';
import path from 'path';

const DB_FILE_BOOKINGS = path.resolve(process.cwd(), 'src/utils/bookings.json');
const DB_FILE_DRIVERS = path.resolve(process.cwd(), 'src/utils/drivers.json');
const DB_FILE_AUDIT_TRAIL = path.resolve(
  process.cwd(),
  'src/utils/auditTrail.json'
);

export function loadBookings() {
  try {
    return (
      JSON.parse(fs.readFileSync(DB_FILE_BOOKINGS, 'utf-8')).bookings || []
    );
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

export function saveBookings(bookings: any[]) {
  fs.writeFileSync(
    DB_FILE_BOOKINGS,
    JSON.stringify({ bookings }, null, 2),
    'utf-8'
  );
}

export function loadDrivers() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE_DRIVERS, 'utf-8')).drivers || [];
  } catch (error) {
    console.error('Error loading drivers:', error);
    return [];
  }
}

export function loadAuditTrail() {
  try {
    return (
      JSON.parse(fs.readFileSync(DB_FILE_AUDIT_TRAIL, 'utf-8')).auditTrail || []
    );
  } catch (error) {
    console.error('Error loading audit trail:', error);
    return [];
  }
}

export function saveAuditTrail(auditTrail: any[]) {
  fs.writeFileSync(
    DB_FILE_AUDIT_TRAIL,
    JSON.stringify({ auditTrail }, null, 2),
    'utf-8'
  );
}
