import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, showService } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { FilterSection } from '../components/FilterSection';
import { Loader, Sparkles, Play } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const moviesRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showsRes] = await Promise.all([
          movieService.getMovies({ limit: 8 }),
          showService.getUpcomingShows({ days: 7 })
        ]);
        setMovies(moviesRes.data.movies);
        setUpcomingShows(showsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartBooking = () => {
    if (moviesRef.current) {
      moviesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMovieClick = (showId) => {
    navigate(`/shows/${showId}/book`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-white text-lg">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 -top-40 -left-40 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -bottom-40 -right-40 animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold uppercase tracking-wide">Premium Experience</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Book Your Movie <span className="text-yellow-300">Tickets</span>
              </h2>
              <p className="text-xl text-gray-100 mb-8 opacity-90">
                Get the best cinematic experience with premium seats, latest blockbusters, and exclusive deals
              </p>
              <button 
                onClick={handleStartBooking}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-5 h-5" />
                Start Booking Now
              </button>
            </div>
            <div className="hidden md:block w-1/2">
              <div className="relative">
                <div className="w-64 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl transform rotate-6 shadow-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-64 h-80 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl transform -rotate-6 shadow-2xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      <div ref={moviesRef} className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h3 className="text-4xl font-bold text-white">Trending Movies</h3>
          </div>
          <p className="text-gray-400 ml-4">Discover the most popular movies right now</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {movies.map((movie, idx) => (
            <div key={movie._id} className="transform hover:scale-105 transition duration-300">
              <MovieCard 
                movie={movie} 
                onClick={() => setSelectedMovie(movie._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Shows Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-700">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
            <h3 className="text-4xl font-bold text-white">Upcoming Shows</h3>
          </div>
          <p className="text-gray-400 ml-4">Don't miss the latest blockbuster releases</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingShows.slice(0, 6).map((show, idx) => (
            <div key={show._id} className="group bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-600 hover:border-purple-500">
              <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-50 group-hover:opacity-100 transition" />
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-xl text-white mb-2 group-hover:text-purple-400 transition">
                  {show.movieId?.title}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-sm">📅 {new Date(show.showTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-sm">⏰ {new Date(show.showTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <span className="text-2xl font-bold text-purple-400">${show.basePrice}</span>
                    <button 
                      onClick={() => handleMovieClick(show._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 cursor-pointer active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
