import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesAPI } from '@/lib/google-places';
import { mockProperties } from '@/data/mockReviews';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');

    // Get configuration info
    const configInfo = googlePlacesAPI.getConfigurationInfo();

    if (!configInfo.isConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Google Places API not configured',
        configuration: configInfo,
        message: 'To enable Google Reviews integration, please configure the Google Places API'
      });
    }

    // If no specific property requested, return configuration info
    if (!propertyId) {
      return NextResponse.json({
        success: true,
        configuration: configInfo,
        message: 'Google Places API is configured and ready to use'
      });
    }

    // Find the property
    const property = mockProperties.find(p => p.id === propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Fetch Google reviews for the property
    const googleReviews = await googlePlacesAPI.getReviewsForProperty(
      property.name,
      `${property.address}, ${property.city}`,
      property.id
    );

    return NextResponse.json({
      success: true,
      data: {
        property: {
          id: property.id,
          name: property.name,
          address: property.address,
          city: property.city
        },
        reviews: googleReviews,
        count: googleReviews.length,
        source: 'Google Places API'
      },
      configuration: configInfo
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Google reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
        configuration: googlePlacesAPI.getConfigurationInfo()
      },
      { status: 500 }
    );
  }
}

// Endpoint to test Google Places API configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyName, propertyAddress } = body;

    if (!propertyName || !propertyAddress) {
      return NextResponse.json(
        { success: false, error: 'Property name and address are required' },
        { status: 400 }
      );
    }

    const configInfo = googlePlacesAPI.getConfigurationInfo();

    if (!configInfo.isConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Google Places API not configured',
        configuration: configInfo
      });
    }

    // Test by searching for the place
    const placeId = await googlePlacesAPI.findPlace(propertyName, propertyAddress);

    if (placeId) {
      // Get place details to test full functionality
      const placeDetails = await googlePlacesAPI.getPlaceDetails(placeId);
      
      return NextResponse.json({
        success: true,
        data: {
          placeId,
          found: true,
          reviewsCount: placeDetails?.reviews?.length || 0,
          rating: placeDetails?.rating || 0,
          totalRatings: placeDetails?.user_ratings_total || 0
        },
        message: 'Google Places API is working correctly'
      });
    } else {
      return NextResponse.json({
        success: true,
        data: {
          placeId: null,
          found: false
        },
        message: 'Property not found in Google Places, but API is working'
      });
    }

  } catch (error) {
    console.error('Error testing Google Places API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test Google Places API',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
