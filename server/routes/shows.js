import express from 'express';
import * as showController from '../controllers/showController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', showController.getShows);
router.get('/upcoming', showController.getUpcomingShows);
router.get('/movie/:movieId', showController.getShowsByMovie);
router.get('/:id', showController.getShowById);
router.post('/', isAdmin, showController.createShow);
router.put('/:id', isAdmin, showController.updateShow);

export default router;
