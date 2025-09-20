'use client';

import { ReviewStats } from '@/types/reviews';
import { Star, TrendingUp, MessageSquare, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface StatsOverviewProps {
  stats: ReviewStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const ratingData = Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count,
    percentage: stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
  })).reverse();

  const channelData = Object.entries(stats.channelBreakdown).map(([channel, count]) => ({
    name: channel.charAt(0).toUpperCase() + channel.slice(1),
    value: count,
    percentage: stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
  }));

  const categoryData = Object.entries(stats.categoryAverages).map(([category, average]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    rating: Math.round(average * 10) / 10
  }));

  const COLORS = ['#2F5233', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4'];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-flex-green" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                <div className="flex">
                  {renderStars(stats.averageRating)}
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.ratingDistribution[5]}</p>
              <p className="text-sm text-green-600 font-medium">
                {stats.totalReviews > 0 ? Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100) : 0}% of total
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.monthlyTrends.length > 0 ? stats.monthlyTrends[stats.monthlyTrends.length - 1]?.count || 0 : 0}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Avg: {stats.monthlyTrends.length > 0 ? (stats.monthlyTrends[stats.monthlyTrends.length - 1]?.averageRating || 0).toFixed(1) : '0.0'}★
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, 'Reviews']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="count" fill="#2F5233" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Reviews by Channel</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          </div>
          <div className="space-y-3">
            {categoryData.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(category.rating)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">
                    {category.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          </div>
          {stats.monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return `${monthNames[parseInt(month) - 1]} ${year}`;
                  }}
                />
                <Bar yAxisId="left" dataKey="count" fill="#2F5233" name="Review Count" />
                <Line yAxisId="right" type="monotone" dataKey="averageRating" stroke="#10B981" strokeWidth={2} name="Avg Rating" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No trend data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
