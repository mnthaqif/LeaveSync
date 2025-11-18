import axios from 'axios';
import pool from '../config/database';
import { format } from 'date-fns';

interface CalendarificHoliday {
  name: string;
  description: string;
  date: {
    iso: string;
  };
  type: string[];
  locations: string;
}

// Map Malaysian states to Calendarific API locations
const STATE_LOCATION_MAP: Record<string, string> = {
  'Johor': 'my-01',
  'Kedah': 'my-02',
  'Kelantan': 'my-03',
  'Melaka': 'my-04',
  'Negeri Sembilan': 'my-05',
  'Pahang': 'my-06',
  'Penang': 'my-07',
  'Perak': 'my-08',
  'Perlis': 'my-09',
  'Selangor': 'my-10',
  'Terengganu': 'my-11',
  'Sabah': 'my-12',
  'Sarawak': 'my-13',
  'Kuala Lumpur': 'my-14',
  'Labuan': 'my-15',
  'Putrajaya': 'my-16'
};

export const fetchAndCachePublicHolidays = async (year: number, state: string): Promise<void> => {
  const apiKey = process.env.CALENDARIFIC_API_KEY;
  
  if (!apiKey) {
    console.log('No Calendarific API key found. Skipping public holiday fetch.');
    return;
  }
  
  try {
    const location = STATE_LOCATION_MAP[state] || 'my';
    const response = await axios.get('https://calendarific.com/api/v2/holidays', {
      params: {
        api_key: apiKey,
        country: 'MY',
        year: year,
        location: location
      }
    });
    
    const holidays = response.data.response.holidays;
    
    for (const holiday of holidays) {
      const date = holiday.date.iso.split('T')[0];
      const isNational = holiday.type.includes('National holiday');
      const holidayState = isNational ? 'National' : state;
      
      // Insert or update
      await pool.query(
        `INSERT INTO public_holiday (date, state, holiday_name, type)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE holiday_name = VALUES(holiday_name), type = VALUES(type)`,
        [date, holidayState, holiday.name, isNational ? 'National' : 'State']
      );
    }
    
    console.log(`Successfully cached ${holidays.length} holidays for ${state} (${year})`);
  } catch (error: any) {
    console.error('Error fetching public holidays:', error.message);
    throw error;
  }
};

export const getPublicHolidaysByState = async (state: string, year?: number): Promise<any[]> => {
  // Check if we have holidays cached
  const currentYear = year || new Date().getFullYear();
  
  let query = `
    SELECT id, date, state, holiday_name, type 
    FROM public_holiday 
    WHERE (state = ? OR state = 'National')
  `;
  const params: any[] = [state];
  
  if (year) {
    query += ' AND YEAR(date) = ?';
    params.push(year);
  }
  
  query += ' ORDER BY date ASC';
  
  const [rows]: any = await pool.query(query, params);
  
  // If no holidays found, try to fetch from API
  if (rows.length === 0 && process.env.CALENDARIFIC_API_KEY) {
    try {
      await fetchAndCachePublicHolidays(currentYear, state);
      // Fetch again after caching
      const [newRows]: any = await pool.query(query, params);
      return newRows;
    } catch (error) {
      console.error('Failed to fetch holidays from API:', error);
    }
  }
  
  return rows;
};
