import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/movies', adminController.getAllMovies);
router.put('/movies/:movieId/status', adminController.updateMovieStatus);
router.get('/shows', adminController.getAllShows);
router.delete('/shows/:showId', adminController.deleteShow);
router.get('/bookings', adminController.getAllBookings);
router.get('/revenue/report', adminController.getRevenueReport);
router.get('/users', adminController.manageUsers);
router.put('/users/:userId/role', adminController.updateUserRole);

export default router;
