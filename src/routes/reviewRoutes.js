import { Router } from 'express';
import { generateAiResponse } from '../controllers/reviewController.js';

const router = Router();

router.route('/').post(generateAiResponse)

export default router