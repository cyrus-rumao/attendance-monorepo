import { Router } from 'express';
import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  getFullSubjectAnalytics,
} from './subject.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const router: Router = Router();
router.post('/', protectRoute, createSubject);
router.get('/', protectRoute, getSubjects);
router.put('/:id', protectRoute, updateSubject);
router.delete('/:id', protectRoute, deleteSubject);
router.get('/:id', protectRoute, getFullSubjectAnalytics);
export default router;
