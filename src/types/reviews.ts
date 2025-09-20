export interface Review {
  id: string;
  listingId: string;
  listingName: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  channel: 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'google';
  category: 'cleanliness' | 'communication' | 'location' | 'value' | 'accuracy' | 'checkin' | 'overall';
  isApproved: boolean;
  isDisplayed: boolean;
  responseFromHost?: string;
  responseDate?: string;
  tags?: string[];
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  averageRating: number;
  totalReviews: number;
  imageUrl: string;
  amenities: string[];
  description: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  channelBreakdown: Record<string, number>;
  categoryAverages: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    count: number;
    averageRating: number;
  }>;
}

export interface FilterOptions {
  rating?: number[];
  channel?: string[];
  category?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  isApproved?: boolean;
  searchTerm?: string;
}

export interface GoogleReviewsResponse {
  reviews: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number | string;
    author_url?: string;
  }>;
  rating: number;
  user_ratings_total: number;
}
