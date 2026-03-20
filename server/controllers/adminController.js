import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import Theatre from '../models/Theatre.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalShows = await Show.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenueByMovie = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingId',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      {
        $group: {
          _id: '$booking.movieId',
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalMovies,
        totalShows,
        totalBookings,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      revenueByMovie,
      bookingsByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments();

    res.json({
      movies,
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

export const updateMovieStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      { isActive },
      { new: true }
    );

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const shows = await Show.find()
      .populate('movieId')
      .populate('theatreId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ showTime: -1 });

    const total = await Show.countDocuments();

    res.json({
      shows,
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

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.showId,
      { isActive: false },
      { new: true }
    );

    res.json({ message: 'Show deleted', show });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(filter)
      .populate('userId')
      .populate('movieId')
      .populate('showId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

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

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { status: 'succeeded' };
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const dailyRevenue = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const movieRevenue = await Payment.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingId',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      {
        $lookup: {
          from: 'movies',
          localField: 'booking.movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $group: {
          _id: '$movie.title',
          revenue: { $sum: '$amount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({ dailyRevenue, movieRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const manageUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
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

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
