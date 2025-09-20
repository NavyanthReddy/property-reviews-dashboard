'use client';

import { Review } from '@/types/reviews';
import { Star, Calendar, User, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface PropertyReviewCardProps {
  review: Review;
  showChannel?: boolean;
}

export default function PropertyReviewCard({ review, showChannel = false }: PropertyReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getChannelColor = (channel: string) => {
    const colors = {
      airbnb: 'bg-red-100 text-red-800',
      booking: 'bg-blue-100 text-blue-800',
      vrbo: 'bg-purple-100 text-purple-800',
      direct: 'bg-green-100 text-green-800',
      google: 'bg-yellow-100 text-yellow-800'
    };
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="py-6 border-b border-gray-200 last:border-b-0">
      {/* Header - Flex Living Style */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-lg">
              {review.guestName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Guest Info */}
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-semibold text-gray-900 truncate">{review.guestName}</h4>
              {showChannel && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(review.channel)}`}>
                  {review.channel.charAt(0).toUpperCase() + review.channel.slice(1)}
                </span>
              )}
            </div>
            
            {/* Rating and Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span>•</span>
              <span>{format(new Date(review.date), 'MMMM yyyy')}</span>
            </div>
          </div>
        </div>
        
        {/* More Options */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Review Content - Flex Living Style */}
      <div className="ml-16">
        <p className="text-gray-700 leading-relaxed mb-4">
          {review.comment}
        </p>

        {/* Host Response - Flex Living Style */}
        {review.responseFromHost && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-flex-green">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-flex-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">F</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">Response from host</span>
                  {review.responseDate && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {format(new Date(review.responseDate), 'MMMM yyyy')}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.responseFromHost}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tags - Flex Living Style */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
