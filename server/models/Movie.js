import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  genre: [String],
  rating: Number,
  duration: Number,
  releaseDate: Date,
  posterUrl: String,
  trailerUrl: String,
  director: String,
  cast: [String],
  language: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Movie', movieSchema);
