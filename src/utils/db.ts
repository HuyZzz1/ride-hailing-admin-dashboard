import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'src/utils/bookings.json');

export function loadBookings() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')).bookings || [];
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

export function saveBookings(bookings: any[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ bookings }, null, 2), 'utf-8');
}
