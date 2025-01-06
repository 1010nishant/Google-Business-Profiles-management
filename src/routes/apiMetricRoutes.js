import { Router } from 'express';
import { apiUsage } from '../controllers/apiMetricController.js';

const router = Router();

router.route('/').get(apiUsage)

export default router