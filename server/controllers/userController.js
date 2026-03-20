import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.user.sub })
      .populate('bookings');

    if (!user) {
      const newUser = new User({
        clerkId: req.user.sub,
        email: req.user.email || '',
        firstName: req.user.first_name || '',
        lastName: req.user.last_name || ''
      });
      await newUser.save();
      return res.json(newUser);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { phoneNumber, preferences } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.user.sub },
      {
        phoneNumber,
        preferences,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const savePaymentMethod = async (req, res) => {
  try {
    const { stripePaymentMethodId, lastFour, brand } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.user.sub },
      {
        $push: {
          savedPaymentMethods: {
            stripePaymentMethodId,
            lastFour,
            brand
          }
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavedPaymentMethods = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.user.sub });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.savedPaymentMethods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const { methodId } = req.params;
    const user = await User.findOneAndUpdate(
      { clerkId: req.user.sub },
      {
        $pull: { savedPaymentMethods: { _id: methodId } }
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.sub;
    const totalBookings = await Booking.countDocuments({ userId });
    const confirmedBookings = await Booking.countDocuments({
      userId,
      status: 'confirmed'
    });

    const totalSpent = await Booking.aggregate([
      { $match: { userId, status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalBookings,
      confirmedBookings,
      totalSpent: totalSpent[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUpcomingBookings = async (req, res) => {
  try {
    const userId = req.user.sub;
    const now = new Date();

    const bookings = await Booking.find({
      userId,
      status: 'confirmed'
    })
      .populate({
        path: 'showId',
        match: { showTime: { $gte: now } }
      })
      .populate('movieId')
      .sort({ 'showId.showTime': 1 });

    const upcomingBookings = bookings.filter(b => b.showId);

    res.json(upcomingBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
