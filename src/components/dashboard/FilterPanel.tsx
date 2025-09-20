'use client';

import { FilterOptions } from '@/types/reviews';
import { Filter, X, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function FilterPanel({ filters, onFiltersChange, onClearFilters }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const channels = ['airbnb', 'booking', 'vrbo', 'direct', 'google'];
  const categories = ['overall', 'cleanliness', 'communication', 'location', 'value', 'accuracy', 'checkin'];
  const ratings = [5, 4, 3, 2, 1];

  const handleRatingToggle = (rating: number) => {
    const currentRatings = filters.rating || [];
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter(r => r !== rating)
      : [...currentRatings, rating];
    
    onFiltersChange({ ...filters, rating: newRatings.length > 0 ? newRatings : undefined });
  };

  const handleChannelToggle = (channel: string) => {
    const currentChannels = filters.channel || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    
    onFiltersChange({ ...filters, channel: newChannels.length > 0 ? newChannels : undefined });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined });
  };

  const handleApprovalFilter = (value: boolean | undefined) => {
    onFiltersChange({ ...filters, isApproved: value });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm: searchTerm || undefined });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const currentRange = filters.dateRange || { start: '', end: '' };
    const newRange = { ...currentRange, [field]: value };
    
    if (!newRange.start && !newRange.end) {
      onFiltersChange({ ...filters, dateRange: undefined });
    } else {
      onFiltersChange({ ...filters, dateRange: newRange });
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.rating?.length) count++;
    if (filters.channel?.length) count++;
    if (filters.category?.length) count++;
    if (filters.isApproved !== undefined) count++;
    if (filters.searchTerm) count++;
    if (filters.dateRange?.start || filters.dateRange?.end) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-flex-green text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-flex-green hover:text-green-700 font-medium"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reviews, guests, or properties..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Rating Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
            <div className="flex flex-wrap gap-2">
              {ratings.map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingToggle(rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                    filters.rating?.includes(rating)
                      ? 'bg-flex-green text-white border-flex-green'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{rating}</span>
                  <span className="text-yellow-400">★</span>
                </button>
              ))}
            </div>
          </div>

          {/* Channel Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Channel</h4>
            <div className="flex flex-wrap gap-2">
              {channels.map(channel => (
                <button
                  key={channel}
                  onClick={() => handleChannelToggle(channel)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors capitalize ${
                    filters.channel?.includes(channel)
                      ? 'bg-flex-green text-white border-flex-green'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors capitalize ${
                    filters.category?.includes(category)
                      ? 'bg-flex-green text-white border-flex-green'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Approval Status Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Approval Status</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprovalFilter(undefined)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  filters.isApproved === undefined
                    ? 'bg-flex-green text-white border-flex-green'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleApprovalFilter(true)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  filters.isApproved === true
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => handleApprovalFilter(false)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  filters.isApproved === false
                    ? 'bg-yellow-600 text-white border-yellow-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Date Range</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
