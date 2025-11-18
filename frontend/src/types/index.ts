export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  state: string;
}

export interface Leave {
  id: number;
  user_id: number;
  user_name: string;
  department: string;
  state: string;
  start_date: string;
  end_date: string;
  leave_type: 'Normal' | 'Connected';
  notes?: string;
  created_at: string;
}

export interface PublicHoliday {
  id: number;
  date: string;
  state: string;
  holiday_name: string;
  type: string;
}

export interface CalendarEvent {
  type: 'leave' | 'holiday';
  date: string;
  title: string;
  color: string;
  data: Leave | PublicHoliday;
}

export type LeaveType = 'Normal' | 'Connected' | 'All';
