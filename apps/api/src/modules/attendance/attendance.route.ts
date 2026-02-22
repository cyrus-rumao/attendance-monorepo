import { Router } from 'express';
import {
  markAttendance,
  getAttendanceByDate,
  deleteAttendance,
  getAttendanceSummary,
} from './attendance.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router: Router = Router();

router.post('/', protectRoute, markAttendance);
router.get('/', protectRoute, getAttendanceByDate);
router.delete('/:id', protectRoute, deleteAttendance);
router.get('/summary', protectRoute, getAttendanceSummary);
export default router;
