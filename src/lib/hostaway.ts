import axios from 'axios';
import { Review } from '@/types/reviews';
import { mockReviews, generateAdditionalReviews } from '@/data/mockReviews';

const HOSTAWAY_BASE_URL = 'https://api.hostaway.com/v1';
const ACCOUNT_ID = '61148';
const API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

// Hostaway API response interface
interface HostawayReviewCategory {
  category: string;
  rating: number;
}

interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId?: number; // May not be in response, we'll extract from listingName
}

interface HostawayResponse {
  status: string;
  result: HostawayReview[];
  count?: number;
}

class HostawayAPI {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Cache-control': 'no-cache'
  };

  async getReviews(): Promise<Review[]> {
    try {
      // First, try to fetch from the actual Hostaway API
      console.log('Attempting to fetch reviews from Hostaway API...');
      
      const response = await axios.get<HostawayResponse>(
        `${HOSTAWAY_BASE_URL}/reviews`,
        {
          headers: this.headers,
          params: {
            accountId: ACCOUNT_ID,
            limit: 100,
            offset: 0
          },
          timeout: 15000
        }
      );

      console.log('Hostaway API Response Status:', response.data.status);
      console.log('Hostaway API Response Count:', response.data.result?.length || 0);

      if (response.data.status === 'success' && response.data.result && response.data.result.length > 0) {
        console.log('Fetched', response.data.result.length, 'reviews from Hostaway API');
        return this.normalizeHostawayReviews(response.data.result);
      } else {
        console.log('No reviews found');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Hostaway API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      } else {
        console.log('Hostaway API Error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Fallback to mock data since Hostaway sandbox has no reviews
    console.log('Using mock data');
    return [...mockReviews, ...generateAdditionalReviews(20)];
  }

  async getListings() {
    try {
      console.log('Fetching listings from Hostaway API...');
      
      const response = await axios.get(
        `${HOSTAWAY_BASE_URL}/listings`,
        {
          headers: this.headers,
          params: {
            accountId: ACCOUNT_ID,
            limit: 50
          },
          timeout: 15000
        }
      );

      console.log('Hostaway Listings Response:', response.data.status);
      return response.data;
    } catch (error) {
      console.log('Error fetching listings from Hostaway:', error instanceof Error ? error.message : 'Unknown error');
      return { result: [] };
    }
  }

  // Normalize Hostaway API response
  private normalizeHostawayReviews(hostawayReviews: HostawayReview[]): Review[] {
    return hostawayReviews.map((review, index) => {
      // Calculate overall rating from category ratings
      const overallRating = this.calculateOverallRating(review);
      
      // Get primary category (first category or 'overall')
      const primaryCategory = this.getPrimaryCategory(review);
      
      // Extract listing ID from listing name or use index
      const listingId = this.extractListingId(review.listingName) || `listing-${index + 1}`;
      
      return {
        id: review.id.toString(),
        listingId: listingId,
        listingName: review.listingName || `Property ${listingId}`,
        guestName: review.guestName || 'Anonymous Guest',
        rating: overallRating,
        comment: review.publicReview || '',
        date: this.normalizeDate(review.submittedAt),
        channel: this.inferChannel(review.listingName), // Infer from listing name patterns
        category: primaryCategory,
        isApproved: review.status === 'published', // Use Hostaway status
        isDisplayed: review.status === 'published', // Default to same as approved
        tags: this.generateTags(review)
      };
    });
  }

  private calculateOverallRating(review: HostawayReview): number {
    // If there's a direct rating, use it
    if (review.rating && review.rating > 0) {
      return Math.min(5, Math.max(1, review.rating));
    }

    // Calculate from category ratings
    if (review.reviewCategory && review.reviewCategory.length > 0) {
      const validRatings = review.reviewCategory
        .map(cat => cat.rating)
        .filter(rating => rating > 0);
      
      if (validRatings.length > 0) {
        const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
        // Convert from 10-point scale to 5-point scale if needed
        return Math.min(5, Math.max(1, Math.round(average > 5 ? average / 2 : average)));
      }
    }

    // Default rating
    return 5;
  }

  private getPrimaryCategory(review: HostawayReview): Review['category'] {
    if (review.reviewCategory && review.reviewCategory.length > 0) {
      const categoryMap: Record<string, Review['category']> = {
        'cleanliness': 'cleanliness',
        'communication': 'communication',
        'location': 'location',
        'value': 'value',
        'accuracy': 'accuracy',
        'checkin': 'checkin',
        'check_in': 'checkin',
        'respect_house_rules': 'overall',
        'overall': 'overall'
      };

      const firstCategory = review.reviewCategory[0].category.toLowerCase();
      return categoryMap[firstCategory] || 'overall';
    }

    return 'overall';
  }

  private extractListingId(listingName: string): string | null {
    // Try to extract ID from listing name patterns
    const patterns = [
      /(\d+)B?\s+N?\d*\s*A?\s*-/, // "2B N1 A - " pattern
      /listing[_-]?(\d+)/i,       // "listing_123" pattern
      /property[_-]?(\d+)/i,      // "property_123" pattern
      /(\d+)$/                    // Ending with number
    ];

    for (const pattern of patterns) {
      const match = listingName.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Generate hash from listing name as fallback
    return Math.abs(this.hashCode(listingName)).toString();
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  private inferChannel(listingName: string): Review['channel'] {
    const name = listingName.toLowerCase();
    
    // Infer channel from listing name patterns or default to direct
    if (name.includes('airbnb') || name.includes('air')) return 'airbnb';
    if (name.includes('booking') || name.includes('book')) return 'booking';
    if (name.includes('vrbo') || name.includes('homeaway')) return 'vrbo';
    
    // Default to direct for Hostaway properties
    return 'direct';
  }

  private normalizeDate(dateString: string): string {
    try {
      // Handle "2020-08-21 22:45:14" format
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      console.warn('Failed to parse date:', dateString);
      return new Date().toISOString();
    }
  }

  private generateTags(review: HostawayReview): string[] {
    const tags: string[] = ['hostaway'];
    
    // Add status tag
    if (review.status) {
      tags.push(review.status);
    }

    // Add category tags
    if (review.reviewCategory) {
      review.reviewCategory.forEach(cat => {
        if (cat.rating >= 8) { // High rating categories
          tags.push(`excellent-${cat.category}`);
        }
      });
    }

    return tags;
  }

  // Test connection to Hostaway API
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('Testing Hostaway API connection...');
      
      const response = await axios.get(
        `${HOSTAWAY_BASE_URL}/listings`,
        {
          headers: this.headers,
          params: {
            accountId: ACCOUNT_ID,
            limit: 1
          },
          timeout: 10000
        }
      );

      return {
        success: true,
        message: 'Successfully connected to Hostaway API',
        data: {
          status: response.data.status,
          listingCount: response.data.result?.length || 0
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: `Hostaway API Error: ${error.response?.status} ${error.response?.statusText}`,
          data: error.response?.data
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const hostawayAPI = new HostawayAPI();
