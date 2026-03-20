import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingService } from '../services/api';
import { Check, Download } from 'lucide-react';

export function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingService.getBookingById(bookingId);
        setBooking(res.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
            <p className="text-gray-600 mt-2">Your ticket has been successfully booked</p>
          </div>

          {booking && (
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-800">{booking.movieId?.title}</h2>
                <p className="text-gray-600 mt-2">
                  {new Date(booking.showId?.showTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 border-b pb-6">
                <div>
                  <p className="text-gray-600 text-sm">Booking Reference</p>
                  <p className="text-xl font-bold text-purple-600">{booking.bookingRef}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount Paid</p>
                  <p className="text-xl font-bold text-gray-800">${booking.totalPrice}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Seats Booked</p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((seat, idx) => (
                    <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-bold">
                      {seat.row}{seat.col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-md font-bold hover:bg-purple-700"
                >
                  <Download className="w-5 h-5" />
                  Download Ticket
                </button>
                <a
                  href="/"
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 rounded-md font-bold hover:bg-gray-300"
                >
                  Back to Home
                </a>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  Please arrive 15 minutes before the show time. Have a great time!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
