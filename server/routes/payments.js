import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/intent', paymentController.createPaymentIntent);
router.post('/success', paymentController.handlePaymentSuccess);
router.get('/history', paymentController.getPaymentHistory);
router.get('/:id', paymentController.getPaymentDetails);
router.post('/:paymentId/refund', paymentController.refundPayment);

export default router;
