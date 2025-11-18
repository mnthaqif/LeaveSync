import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { getAllLeaves, createLeave, deleteLeave } from '../controllers/leaveController';
import { getPublicHolidays, refreshPublicHolidays } from '../controllers/publicHolidayController';

const router = Router();

// User routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Leave routes
router.get('/leaves', getAllLeaves);
router.post('/leaves', createLeave);
router.delete('/leaves/:id', deleteLeave);

// Public holiday routes
router.get('/public-holidays/:state', getPublicHolidays);
router.post('/public-holidays/refresh', refreshPublicHolidays);

export default router;
