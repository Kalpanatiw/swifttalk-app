import express from 'express';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/user/all', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/:showId/seats', bookingController.getAvailableSeats);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/confirm', bookingController.confirmBooking);

export default router;
