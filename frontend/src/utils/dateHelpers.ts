import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const getMonthDays = (date: Date): Date[] => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const getLeaveColor = (leaveType: string): string => {
  switch (leaveType) {
    case 'Connected':
      return '#f59e0b'; // Orange/amber
    case 'Normal':
      return '#10b981'; // Green
    default:
      return '#6b7280'; // Gray
  }
};

export const getHolidayColor = (): string => {
  return '#3b82f6'; // Blue
};

export const malaysianStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Selangor',
  'Terengganu',
  'Sabah',
  'Sarawak',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya'
];

export const departments = [
  'Engineering',
  'Marketing',
  'HR',
  'Finance',
  'Sales',
  'Operations',
  'IT',
  'Legal'
];
