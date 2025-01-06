import { Router } from 'express';
import { updateListing } from '../controllers/batchUpdateController.js';
const router = Router();

router.route('/').post(updateListing)

export default router