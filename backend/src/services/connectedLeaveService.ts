import { format, parseISO, addDays, subDays } from 'date-fns';
import pool from '../config/database';

interface PublicHoliday {
  date: string;
  state: string;
  holiday_name: string;
}

// Malaysia weekend days by state
// Most states: Saturday-Sunday
// Johor, Kedah, Kelantan, Terengganu: Friday-Saturday
const FRIDAY_SATURDAY_STATES = ['Johor', 'Kedah', 'Kelantan', 'Terengganu'];

export const isWeekend = (date: Date, state: string): boolean => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (FRIDAY_SATURDAY_STATES.includes(state)) {
    return dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday
  } else {
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  }
};

export const isPublicHoliday = async (date: Date, state: string): Promise<boolean> => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const [rows]: any = await pool.query(
    'SELECT id FROM public_holiday WHERE date = ? AND (state = ? OR state = "National")',
    [dateStr, state]
  );
  
  return rows.length > 0;
};

export const detectConnectedLeave = async (
  startDate: string,
  endDate: string,
  state: string
): Promise<boolean> => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Check day before start date
  const dayBeforeStart = subDays(start, 1);
  const isBeforeWeekend = isWeekend(dayBeforeStart, state);
  const isBeforeHoliday = await isPublicHoliday(dayBeforeStart, state);
  
  if (isBeforeWeekend || isBeforeHoliday) {
    return true;
  }
  
  // Check day after end date
  const dayAfterEnd = addDays(end, 1);
  const isAfterWeekend = isWeekend(dayAfterEnd, state);
  const isAfterHoliday = await isPublicHoliday(dayAfterEnd, state);
  
  if (isAfterWeekend || isAfterHoliday) {
    return true;
  }
  
  return false;
};

export const getAllPublicHolidays = async (state?: string): Promise<PublicHoliday[]> => {
  let query = 'SELECT date, state, holiday_name FROM public_holiday';
  const params: any[] = [];
  
  if (state) {
    query += ' WHERE state = ? OR state = "National"';
    params.push(state);
  }
  
  query += ' ORDER BY date ASC';
  
  const [rows]: any = await pool.query(query, params);
  return rows;
};
