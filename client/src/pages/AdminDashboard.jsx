import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Loader, BarChart3, Users, Ticket, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const cards = [
    { title: 'Total Movies', value: stats?.stats.totalMovies, icon: Ticket, color: 'from-purple-600 to-purple-400' },
    { title: 'Total Shows', value: stats?.stats.totalShows, icon: BarChart3, color: 'from-blue-600 to-blue-400' },
    { title: 'Total Bookings', value: stats?.stats.totalBookings, icon: Ticket, color: 'from-green-600 to-green-400' },
    { title: 'Total Users', value: stats?.stats.totalUsers, icon: Users, color: 'from-pink-600 to-pink-400' },
    { title: 'Total Revenue', value: `$${stats?.stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'from-yellow-600 to-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className={`bg-gradient-to-br ${card.color} text-white rounded-lg shadow-lg p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90 mb-2">{card.title}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <Icon className="w-8 h-8 opacity-75" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Bookings by Status</h3>
            {stats?.bookingsByStatus.map(item => (
              <div key={item._id} className="flex justify-between mb-3">
                <span className="capitalize text-gray-700">{item._id}</span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Top Movies by Revenue</h3>
            {stats?.revenueByMovie.slice(0, 5).map((movie, idx) => (
              <div key={idx} className="flex justify-between mb-3">
                <span className="text-gray-700 truncate">Movie {idx + 1}</span>
                <span className="font-bold text-purple-600">${movie.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
