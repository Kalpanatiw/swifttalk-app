import React, { useState } from 'react';
import { Menu, X, Ticket, Home, Bookmark, User, LogOut } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Ticket className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-widest">TicketHub</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-1 hover:text-pink-200 transition duration-300 font-semibold">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
            <a href="/movies" className="hover:text-pink-200 transition duration-300 font-semibold">Movies</a>
            <a href="/bookings" className="flex items-center space-x-1 hover:text-pink-200 transition duration-300 font-semibold">
              <Bookmark className="w-5 h-5" />
              <span>My Bookings</span>
            </a>
            <button className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-full font-semibold transition duration-300 transform hover:scale-105">
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="/" className="block px-4 py-2 hover:bg-purple-600 rounded-md transition">Home</a>
            <a href="/movies" className="block px-4 py-2 hover:bg-purple-600 rounded-md transition">Movies</a>
            <a href="/bookings" className="block px-4 py-2 hover:bg-purple-600 rounded-md transition">My Bookings</a>
            <button className="w-full bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md font-semibold transition">Sign In</button>
          </div>
        )}
      </div>
    </nav>
  );
}
