import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Loader, Calendar, MapPin, Ticket, Download, Copy } from 'lucide-react';

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await userService.getUpcomingBookings();
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-white text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-white mb-2">My Bookings</h2>
          <p className="text-gray-400 text-lg">Manage and view all your movie tickets</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-16 text-center border border-gray-700">
            <Ticket className="w-16 h-16 mx-auto text-gray-500 mb-6" />
            <p className="text-gray-400 text-xl mb-6">No upcoming bookings yet</p>
            <a 
              href="/" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold inline-block transition transform hover:scale-105"
            >
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, idx) => (
              <div 
                key={booking._id}
                className="group bg-gradient-to-br from-gray-800 via-gray-750 to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-700 hover:border-purple-500 overflow-hidden transform hover:scale-102"
              >
                {/* Status Bar */}
                <div className={`h-1 bg-gradient-to-r ${
                  booking.status === 'confirmed' 
                    ? 'from-green-500 to-emerald-500' 
                    : 'from-yellow-500 to-orange-500'
                }`}></div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Movie Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition">
                        {booking.movieId?.title}
                      </h3>
                      
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-purple-500" />
                          <span className="text-sm">
                            {new Date(booking.showId?.showTime).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-purple-500" />
                          <span className="text-sm">
                            {new Date(booking.showId?.showTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5 text-purple-500" />
                          <span className="text-sm">
                            Seats: <span className="font-bold text-purple-400">{booking.seats.map(s => s.seatId).join(', ')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Reference */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Booking Reference</p>
                      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
                        <p className="font-mono text-white font-bold text-sm break-all mb-3">{booking.bookingRef}</p>
                        <button
                          onClick={() => copyToClipboard(booking.bookingRef, booking._id)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded transition flex items-center justify-center gap-2"
                        >
                          <Copy className="w-3 h-3" />
                          {copied === booking._id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Status & Price */}
                    <div className="text-right">
                      <div className="mb-6">
                        <span className={`inline-block px-6 py-2 rounded-full text-white font-bold text-sm mb-4 ${
                          booking.status === 'confirmed' 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                            : 'bg-gradient-to-r from-yellow-600 to-orange-600'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-4">
                        <p className="text-gray-200 text-xs uppercase tracking-widest mb-1">Total Price</p>
                        <p className="text-4xl font-bold text-white">${booking.totalPrice}</p>
                      </div>
                      <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
