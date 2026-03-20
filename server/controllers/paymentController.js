import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user.sub;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        bookingId: bookingId.toString(),
        userId
      }
    });

    const payment = new Payment({
      bookingId,
      userId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'succeeded';
      payment.transactionId = paymentIntent.id;
      await payment.save();

      const booking = await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: payment._id
      }, { new: true });

      res.json({
        message: 'Payment successful',
        booking,
        payment
      });
    } else {
      payment.status = 'failed';
      payment.failureReason = paymentIntent.last_payment_error?.message;
      await payment.save();
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status === 'refunded') {
      return res.status(400).json({ error: 'Already refunded' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId
    });

    payment.status = 'refunded';
    payment.refundAmount = payment.amount;
    payment.refundedAt = new Date();
    await payment.save();

    const booking = await Booking.findById(payment.bookingId);
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      message: 'Refund successful',
      refundId: refund.id,
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId');

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
