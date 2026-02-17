import { Router } from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { markPresent } from '../controllers/user.controller.js';

const router: Router = Router();


router.post('/present', protectRoute, markPresent);
export default router;