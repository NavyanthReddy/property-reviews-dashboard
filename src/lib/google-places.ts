import { Client } from '@googlemaps/google-maps-services-js';
import { Review, GoogleReviewsResponse } from '@/types/reviews';

// API key should be stored in environment variables
// and the Google Places API should be enabled in the Google Cloud Console
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface GooglePlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number | string;
  author_url?: string;
  profile_photo_url?: string;
}

interface GooglePlaceDetailsResponse {
  result: {
    reviews?: GooglePlaceReview[];
    rating?: number;
    user_ratings_total?: number;
    name?: string;
    place_id?: string;
  };
  status: string;
}

class GooglePlacesAPI {
  private client: Client;

  constructor() {
    this.client = new Client({});
  }

  /**
   * Search for a place by name and address to get place_id
   */
  async findPlace(name: string, address: string): Promise<string | null> {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured');
      return null;
    }

    try {
      const response = await this.client.findPlaceFromText({
        params: {
          input: `${name} ${address}`,
          inputtype: 'textquery' as any,
          fields: ['place_id', 'name', 'formatted_address'],
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.status === 'OK' && response.data.candidates.length > 0) {
        return response.data.candidates[0].place_id || null;
      }

      return null;
    } catch (error) {
      console.error('Error finding place:', error);
      return null;
    }
  }

  /**
   * Get place details including reviews
   */
  async getPlaceDetails(placeId: string): Promise<GoogleReviewsResponse | null> {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured');
      return null;
    }

    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: ['reviews', 'rating', 'user_ratings_total', 'name'],
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.status === 'OK' && response.data.result) {
        const result = response.data.result;
        return {
          reviews: (result.reviews || []) as GooglePlaceReview[],
          rating: result.rating || 0,
          user_ratings_total: result.user_ratings_total || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  /**
   * Convert Google Reviews to our Review format
   */
  normalizeGoogleReviews(
    googleReviews: GooglePlaceReview[],
    listingId: string,
    listingName: string
  ): Review[] {
    return googleReviews.map((googleReview, index) => ({
      id: `google-${listingId}-${index}`,
      listingId,
      listingName,
      guestName: googleReview.author_name || 'Anonymous',
      rating: googleReview.rating || 5,
      comment: googleReview.text || '',
      date: new Date(typeof googleReview.time === 'number' ? googleReview.time * 1000 : googleReview.time).toISOString(),
      channel: 'google' as const,
      category: 'overall' as const,
      isApproved: false, // Default to not approved for new Google reviews
      isDisplayed: false,
      tags: ['google-reviews'],
    }));
  }

  /**
   * Get reviews for a property by searching for it first
   */
  async getReviewsForProperty(
    propertyName: string,
    propertyAddress: string,
    listingId: string
  ): Promise<Review[]> {
    try {
      // Step 1: Find the place
      const placeId = await this.findPlace(propertyName, propertyAddress);
      if (!placeId) {
        console.log(`Could not find place ID for ${propertyName}`);
        return [];
      }

      // Step 2: Get place details with reviews
      const placeDetails = await this.getPlaceDetails(placeId);
      if (!placeDetails || !placeDetails.reviews) {
        console.log(`No reviews found for ${propertyName}`);
        return [];
      }

      // Step 3: Normalize and return reviews
      return this.normalizeGoogleReviews(
        placeDetails.reviews,
        listingId,
        propertyName
      );
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      return [];
    }
  }

  /**
   * Check if Google Places API is configured and available
   */
  isConfigured(): boolean {
    return !!GOOGLE_MAPS_API_KEY;
  }

  /**
   * Get configuration status and requirements
   */
  getConfigurationInfo() {
    return {
      isConfigured: this.isConfigured(),
      requirements: [
        'Google Cloud Project with Places API enabled',
        'API Key with Places API access',
        'Environment variable GOOGLE_MAPS_API_KEY set',
        'Billing account configured (Places API requires billing)',
      ],
      limitations: [
        'Limited to 5 reviews per place (Google limitation)',
        'Reviews are not real-time, cached by Google',
        'No ability to respond to Google reviews via API',
        'Rate limits apply based on API usage tier',
      ],
      costs: [
        'Place Search: $17 per 1000 requests',
        'Place Details: $17 per 1000 requests',
        'First $200/month free with Google Cloud credits',
      ],
    };
  }
}

export const googlePlacesAPI = new GooglePlacesAPI();
