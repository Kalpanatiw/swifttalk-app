export const generateBookingReference = () => {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const validateBookingData = (data) => {
  const { showId, seats, userId } = data;

  if (!showId) return { valid: false, error: 'Show ID is required' };
  if (!Array.isArray(seats) || seats.length === 0) return { valid: false, error: 'At least one seat is required' };
  if (!userId) return { valid: false, error: 'User ID is required' };

  return { valid: true };
};

export const calculateBookingPrice = (seats) => {
  return seats.reduce((total, seat) => total + (seat.price || 0), 0);
};

export const checkSeatAvailability = (bookedSeats, selectedSeats) => {
  const bookedSet = new Set(bookedSeats.map(s => `${s.row}-${s.col}`));
  return selectedSeats.every(s => !bookedSet.has(`${s.row}-${s.col}`));
};

export const formatShowtime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getAvailableSeatsCount = (totalSeats, bookedSeats) => {
  return totalSeats - bookedSeats.length;
};
