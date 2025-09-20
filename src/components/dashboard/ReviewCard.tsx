'use client';

import { Review } from '@/types/reviews';
import { Star, Calendar, MapPin, MessageSquare, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onApprovalToggle: (reviewId: string, approved: boolean) => void;
  onDisplayToggle: (reviewId: string, displayed: boolean) => void;
}

export default function ReviewCard({ review, onApprovalToggle, onDisplayToggle }: ReviewCardProps) {
  const getChannelColor = (channel: string) => {
    const colors = {
      airbnb: 'bg-red-100 text-red-800 border-red-200',
      booking: 'bg-blue-100 text-blue-800 border-blue-200',
      vrbo: 'bg-purple-100 text-purple-800 border-purple-200',
      direct: 'bg-green-100 text-green-800 border-green-200',
      google: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      overall: 'bg-indigo-100 text-indigo-800',
      cleanliness: 'bg-teal-100 text-teal-800',
      communication: 'bg-blue-100 text-blue-800',
      location: 'bg-green-100 text-green-800',
      value: 'bg-orange-100 text-orange-800',
      accuracy: 'bg-purple-100 text-purple-800',
      checkin: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-500 ml-1">({review.rating})</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{review.listingName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(review.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getChannelColor(review.channel)}`}>
              {review.channel.charAt(0).toUpperCase() + review.channel.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(review.category)}`}>
              {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
              review.isApproved ? 'status-approved' : 'status-pending'
            }`}>
              {review.isApproved ? 'Approved' : 'Pending'}
            </span>
            {review.isDisplayed && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Displayed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <div className="flex items-start space-x-2 mb-3">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
        
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Host Response */}
      {review.responseFromHost && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-xs text-gray-500 mb-1">Host Response:</div>
          <p className="text-sm text-gray-700">{review.responseFromHost}</p>
          {review.responseDate && (
            <div className="text-xs text-gray-500 mt-1">
              {format(new Date(review.responseDate), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onApprovalToggle(review.id, !review.isApproved)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              review.isApproved
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {review.isApproved ? (
              <>
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </>
            )}
          </button>

          {review.isApproved && (
            <button
              onClick={() => onDisplayToggle(review.id, !review.isDisplayed)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                review.isDisplayed
                  ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  : 'bg-blue-50 text-green-700 hover:bg-blue-100'
              }`}
            >
              {review.isDisplayed ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Display</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-xs text-gray-400">
          ID: {review.id}
        </div>
      </div>
    </div>
  );
}
