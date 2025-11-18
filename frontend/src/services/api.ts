import axios from 'axios';
import Constants from 'expo-constants';
import { User, Leave, PublicHoliday } from '../types';

// Get API URL from environment or use default
const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Leave API
export const getLeaves = async (filters?: {
  user_id?: number;
  department?: string;
  leave_type?: string;
  state?: string;
  start_date?: string;
  end_date?: string;
}): Promise<Leave[]> => {
  const response = await api.get('/leaves', { params: filters });
  return response.data;
};

export const createLeave = async (leave: {
  user_id: number;
  start_date: string;
  end_date: string;
  notes?: string;
}): Promise<Leave> => {
  const response = await api.post('/leaves', leave);
  return response.data;
};

export const deleteLeave = async (id: number): Promise<void> => {
  await api.delete(`/leaves/${id}`);
};

// Public Holiday API
export const getPublicHolidays = async (state: string, year?: number): Promise<PublicHoliday[]> => {
  const params = year ? { year } : {};
  const response = await api.get(`/public-holidays/${state}`, { params });
  return response.data;
};

export const refreshPublicHolidays = async (state: string, year: number): Promise<void> => {
  await api.post('/public-holidays/refresh', { state, year });
};

export default api;
