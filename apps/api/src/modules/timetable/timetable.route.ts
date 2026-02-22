import { Router } from 'express';
import {
  saveTimetable,
  getTimetable,
  deleteTimetable,
  // editTimetable
} from './timetable.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router: Router = Router();

router.get('/', protectRoute, getTimetable);
router.post('/', protectRoute, saveTimetable);
router.delete('/', protectRoute, deleteTimetable);
export default router;
