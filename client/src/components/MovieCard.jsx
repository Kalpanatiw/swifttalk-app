import React from 'react';
import { Star, Calendar, Clock, Ticket } from 'lucide-react';

export function MovieCard({ movie, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-600 hover:border-purple-500"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-gray-900">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 rounded-full p-2 flex items-center gap-1 font-bold shadow-lg">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm">{movie.rating?.toFixed(1) || 'N/A'}</span>
        </div>

        {/* Hover Action Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition duration-300 active:scale-95 cursor-pointer"
          >
            <Ticket className="w-5 h-5" />
            Book Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg mb-3 truncate text-white group-hover:text-purple-300 transition">
          {movie.title}
        </h3>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre?.slice(0, 2).map((g, i) => (
            <span key={i} className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full font-semibold">
              {g}
            </span>
          ))}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>{movie.duration} mins</span>
        </div>

        {/* Director */}
        {movie.director && (
          <div className="text-xs text-gray-500 mb-3 truncate">
            <span className="text-gray-400">Director: </span>
            <span className="text-purple-400 font-semibold">{movie.director}</span>
          </div>
        )}

        {/* Language Info */}
        {movie.language && (
          <div className="text-xs text-gray-400 mb-4">🌐 {movie.language}</div>
        )}

        {/* Show More Details */}
        <div className="pt-4 border-t border-gray-600 mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            View Shows
          </button>
        </div>
      </div>
    </div>
  );
}
