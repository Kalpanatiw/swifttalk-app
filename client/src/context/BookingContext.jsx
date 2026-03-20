import React, { createContext, useState, useCallback } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const addSeat = useCallback((seat) => {
    setSelectedSeats(prev => [...prev, seat]);
  }, []);

  const removeSeat = useCallback((seatId) => {
    setSelectedSeats(prev => prev.filter(s => s.seatId !== seatId));
  }, []);

  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const updateShow = useCallback((show) => {
    setSelectedShow(show);
  }, []);

  const updateBookingData = useCallback((data) => {
    setBookingData(data);
  }, []);

  const value = {
    selectedSeats,
    selectedShow,
    bookingData,
    addSeat,
    removeSeat,
    clearSeats,
    updateShow,
    updateBookingData
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
