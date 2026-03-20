import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  showTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: Date,
  format: String,
  language: String,
  seatLayout: {
    rows: Number,
    cols: Number,
    totalSeats: Number
  },
  availableSeats: Number,
  basePrice: {
    type: Number,
    required: true
  },
  premiumPrice: Number,
  capacity: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Show', showSchema);
