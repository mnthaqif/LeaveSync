import { Request, Response } from 'express';
import { getPublicHolidaysByState, fetchAndCachePublicHolidays } from '../services/publicHolidayService';

export const getPublicHolidays = async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    const { year } = req.query;
    
    if (!state) {
      return res.status(400).json({ error: 'State parameter is required' });
    }
    
    const holidays = await getPublicHolidaysByState(
      state,
      year ? parseInt(year as string) : undefined
    );
    
    res.json(holidays);
  } catch (error: any) {
    console.error('Error fetching public holidays:', error);
    res.status(500).json({ error: 'Failed to fetch public holidays', message: error.message });
  }
};

export const refreshPublicHolidays = async (req: Request, res: Response) => {
  try {
    const { state, year } = req.body;
    
    if (!state || !year) {
      return res.status(400).json({ error: 'State and year are required' });
    }
    
    await fetchAndCachePublicHolidays(year, state);
    
    res.json({ message: `Public holidays refreshed for ${state} (${year})` });
  } catch (error: any) {
    console.error('Error refreshing public holidays:', error);
    res.status(500).json({ error: 'Failed to refresh public holidays', message: error.message });
  }
};
