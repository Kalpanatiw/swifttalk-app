import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.get('/stats', userController.getUserStats);
router.get('/bookings/upcoming', userController.getUpcomingBookings);
router.post('/payment-methods', userController.savePaymentMethod);
router.get('/payment-methods', userController.getSavedPaymentMethods);
router.delete('/payment-methods/:methodId', userController.deletePaymentMethod);

export default router;
