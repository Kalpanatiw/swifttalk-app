import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  screens: [
    {
      screenName: String,
      rows: Number,
      cols: Number,
      totalSeats: Number
    }
  ],
  amenities: [String],
  phone: String,
  email: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Theatre', theatreSchema);
