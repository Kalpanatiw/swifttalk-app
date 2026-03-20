import React from 'react';
import { Clock, MapPin } from 'lucide-react';

export function ShowCard({ show, movie, onClick }) {
  const showTime = new Date(show.showTime);
  const timeStr = showTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = showTime.toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-gray-800">{movie?.title}</h4>
          <p className="text-sm text-gray-500">{show.format} | {show.language}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
          {show.availableSeats} seats
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          {timeStr} ({dateStr})
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          Theatre
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-purple-600">${show.basePrice}</p>
        </div>
        <button
          onClick={onClick}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-lg transition"
        >
          Book Seats
        </button>
      </div>
    </div>
  );
}
