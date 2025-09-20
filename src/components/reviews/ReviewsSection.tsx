'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types/reviews';
import PropertyReviewCard from './PropertyReviewCard';
import { Star, MessageSquare, Filter, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface ReviewsSectionProps {
  propertyId: string;
  propertyName: string;
}

export default function ReviewsSection({ propertyId, propertyName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const displayLimit = 6;

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  useEffect(() => {
    let filtered = reviews.filter(review => 
      review.isApproved && review.isDisplayed && review.listingId === propertyId
    );

    if (selectedRating) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }

    if (selectedCategory) {
      filtered = filtered.filter(review => review.category === selectedCategory);
    }

    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredReviews(filtered);
  }, [reviews, propertyId, selectedRating, selectedCategory]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/reviews/hostaway');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Fetch error');
      }

      setReviews(data.data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / filteredReviews.length) * 10) / 10;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const getCategoryDistribution = () => {
    const categories: Record<string, number> = {};
    filteredReviews.forEach(review => {
      categories[review.category] = (categories[review.category] || 0) + 1;
    });
    return categories;
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, displayLimit);
  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const categoryDistribution = getCategoryDistribution();

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-flex-green text-white rounded-lg hover:bg-flex-green-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">Be the first to share your experience at this property!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 border-t border-gray-200">
      {/* Reviews Header - Flex Living Style */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <span className="text-2xl font-bold text-gray-900">{filteredReviews.length} reviews</span>
        </div>
        
        {/* Rating Breakdown - Flex Living Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Rating Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Rating breakdown</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = filteredReviews.length > 0 ? (count / filteredReviews.length) * 100 : 0;
                
                return (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedRating === rating ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="text-sm text-gray-700 w-8">{rating}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Review categories</h4>
            <div className="space-y-2">
              {Object.entries(categoryDistribution).slice(0, 5).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedCategory === category ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedRating || selectedCategory) && (
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm text-gray-600">Filtered by:</span>
            {selectedRating && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {selectedRating} stars
                <button
                  onClick={() => setSelectedRating(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reviews Grid - Flex Living Style */}
      <div className="grid gap-6 mb-8">
        {displayedReviews.map((review) => (
          <PropertyReviewCard key={review.id} review={review} showChannel={false} />
        ))}
      </div>

      {/* Show More/Less Button - Flex Living Style */}
      {filteredReviews.length > displayLimit && (
        <div className="text-center">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-200"
          >
            <span>
              {showAllReviews 
                ? `Show less` 
                : `Show all ${filteredReviews.length} reviews`
              }
            </span>
            {showAllReviews ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
