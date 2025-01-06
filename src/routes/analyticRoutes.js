import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/analyticController.js';
const router = Router();

router.route('/').get(getDashboardMetrics)

export default router