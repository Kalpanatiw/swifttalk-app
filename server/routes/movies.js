import express from 'express';
import * as movieController from '../controllers/movieController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', movieController.getMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', isAdmin, movieController.createMovie);
router.put('/:id', isAdmin, movieController.updateMovie);
router.delete('/:id', isAdmin, movieController.deleteMovie);

export default router;
