import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { getAllLeaves, createLeave, deleteLeave } from '../controllers/leaveController';
import { getPublicHolidays, refreshPublicHolidays } from '../controllers/publicHolidayController';
import { createLimiter, strictLimiter } from '../middleware/rateLimiter';

const router = Router();

// User routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Leave routes
router.get('/leaves', getAllLeaves);
router.post('/leaves', createLimiter, createLeave);
router.delete('/leaves/:id', createLimiter, deleteLeave);

// Public holiday routes
router.get('/public-holidays/:state', getPublicHolidays);
router.post('/public-holidays/refresh', strictLimiter, refreshPublicHolidays);

export default router;
