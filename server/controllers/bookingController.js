import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import crypto from 'crypto';

export const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.sub;

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const totalPrice = seats.reduce((sum, seat) => sum + (seat.price || 0), 0);
    
    const bookingRef = `BK${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const booking = new Booking({
      userId,
      showId,
      movieId: show.movieId,
      seats,
      totalPrice,
      bookingRef
    });

    await booking.save();

    await Show.findByIdAndUpdate(showId, {
      availableSeats: show.availableSeats - seats.length
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('showId');
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    if (booking.userId !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(filter)
      .populate('movieId')
      .populate('showId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
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

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    if (booking.userId !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Already cancelled' });
    }

    const show = await Show.findById(booking.showId);
    await Show.findByIdAndUpdate(booking.showId, {
      availableSeats: show.availableSeats + booking.seats.length
    });

    booking.status = 'cancelled';
    booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : 'unpaid';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId);

    if (!show) return res.status(404).json({ error: 'Show not found' });

    const bookedSeats = await Booking.find({
      showId,
      status: { $ne: 'cancelled' }
    });

    const bookedSeatNumbers = new Set();
    bookedSeats.forEach(booking => {
      booking.seats.forEach(seat => {
        bookedSeatNumbers.add(`${seat.row}-${seat.col}`);
      });
    });

    const seatLayout = [];
    for (let row = 0; row < show.seatLayout.rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < show.seatLayout.cols; col++) {
        const seatId = `${String.fromCharCode(65 + row)}-${col + 1}`;
        rowSeats.push({
          seatId,
          isBooked: bookedSeatNumbers.has(seatId),
          price: col < 4 ? show.basePrice : (show.premiumPrice || show.basePrice)
        });
      }
      seatLayout.push(rowSeats);
    }

    res.json({
      showId,
      totalSeats: show.seatLayout.totalSeats,
      availableSeats: show.availableSeats,
      seatLayout
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    if (booking.userId !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
