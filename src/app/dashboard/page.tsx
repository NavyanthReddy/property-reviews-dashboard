'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Review, ReviewStats, FilterOptions } from '@/types/reviews';
import ReviewCard from '@/components/dashboard/ReviewCard';
import FilterPanel from '@/components/dashboard/FilterPanel';
import StatsOverview from '@/components/dashboard/StatsOverview';
import { ArrowLeft, Download, RefreshCw, SortAsc, SortDesc, MessageSquare } from 'lucide-react';

type SortOption = 'date' | 'rating' | 'guestName' | 'listingName';
type SortDirection = 'asc' | 'desc';

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showStats, setShowStats] = useState(true);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.rating?.length) queryParams.set('rating', filters.rating.join(','));
      if (filters.channel?.length) queryParams.set('channel', filters.channel.join(','));
      if (filters.category?.length) queryParams.set('category', filters.category.join(','));
      if (filters.isApproved !== undefined) queryParams.set('isApproved', filters.isApproved.toString());
      if (filters.searchTerm) queryParams.set('searchTerm', filters.searchTerm);
      if (filters.dateRange?.start) queryParams.set('startDate', filters.dateRange.start);
      if (filters.dateRange?.end) queryParams.set('endDate', filters.dateRange.end);

      const response = await fetch(`/api/reviews/hostaway?${queryParams}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Fetch error');
      }

      setReviews(data.data.reviews);
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchReviews();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reviews];

    // Sort reviews
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'guestName':
          aValue = a.guestName.toLowerCase();
          bValue = b.guestName.toLowerCase();
          break;
        case 'listingName':
          aValue = a.listingName.toLowerCase();
          bValue = b.listingName.toLowerCase();
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, sortBy, sortDirection]);

  // Handle review approval toggle
  const handleApprovalToggle = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/reviews/hostaway', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          updates: { isApproved: approved }
        }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, isApproved: approved, isDisplayed: approved ? review.isDisplayed : false }
            : review
        ));
      }
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };

  // Handle review display toggle
  const handleDisplayToggle = async (reviewId: string, displayed: boolean) => {
    try {
      const response = await fetch('/api/reviews/hostaway', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          updates: { isDisplayed: displayed }
        }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? { ...review, isDisplayed: displayed } : review
        ));
      }
    } catch (error) {
      console.error('Error updating review display:', error);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Re-fetch with new filters
    fetchReviews();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    fetchReviews();
  };

  // Handle sort change
  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  // Export reviews (placeholder)
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Guest Name', 'Rating', 'Comment', 'Date', 'Channel', 'Category', 'Approved', 'Displayed'].join(','),
      ...filteredReviews.map(review => [
        review.id,
        `"${review.guestName}"`,
        review.rating,
        `"${review.comment.replace(/"/g, '""')}"`,
        review.date,
        review.channel,
        review.category,
        review.isApproved,
        review.isDisplayed
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !reviews.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-flex-green mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading reviews: {error}</div>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-flex-green text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Manage and monitor guest reviews across all properties
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={fetchReviews}
                className="flex items-center space-x-2 px-4 py-2 bg-flex-green text-white rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {showStats && stats && (
          <div className="mb-8">
            <StatsOverview stats={stats} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <div className="flex space-x-2">
                    {(['date', 'rating', 'guestName', 'listingName'] as const).map(option => (
                      <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                          sortBy === option
                            ? 'bg-flex-green text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="capitalize">{option.replace('Name', ' Name')}</span>
                        {sortBy === option && (
                          sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {filteredReviews.length} of {reviews.length} reviews
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onApprovalToggle={handleApprovalToggle}
                    onDisplayToggle={handleDisplayToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-500 mb-4">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No reviews found</p>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-flex-green text-white rounded-lg hover:bg-green-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
