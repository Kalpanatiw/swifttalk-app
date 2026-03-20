import Movie from '../models/Movie.js';

export const getMovies = async (req, res) => {
  try {
    const { genre, language, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    
    if (genre) filter.genre = { $in: [genre] };
    if (language) filter.language = { $in: [language] };

    const skip = (page - 1) * limit;
    const movies = await Movie.find(filter)
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(filter);

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

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const movies = await Movie.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $in: [new RegExp(query, 'i')] } },
        { director: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
