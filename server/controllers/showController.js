import Show from '../models/Show.js';

export const getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (movieId) filter.movieId = movieId;
    if (theatreId) filter.theatreId = theatreId;

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.showTime = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    const shows = await Show.find(filter)
      .populate('movieId', 'title duration genre')
      .sort({ showTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Show.countDocuments(filter);

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

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId');
    if (!show) return res.status(404).json({ error: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!show) return res.status(404).json({ error: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const filter = { movieId, isActive: true };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.showTime = { $gte: startDate, $lt: endDate };
    }

    const shows = await Show.find(filter)
      .populate('theatreId')
      .sort({ showTime: 1 });

    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUpcomingShows = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const shows = await Show.find({
      isActive: true,
      showTime: { $gte: startDate, $lte: endDate }
    })
      .populate('movieId')
      .populate('theatreId')
      .sort({ showTime: 1 });

    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
