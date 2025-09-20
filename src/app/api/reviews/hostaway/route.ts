import { NextRequest, NextResponse } from 'next/server';
import { hostawayAPI } from '@/lib/hostaway';
import { Review, ReviewStats, FilterOptions } from '@/types/reviews';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  try {
    const filters: FilterOptions = {
      rating: searchParams.get('rating')?.split(',').map(Number),
      channel: searchParams.get('channel')?.split(','),
      category: searchParams.get('category')?.split(','),
      isApproved: searchParams.get('isApproved') === 'true' ? true : 
                   searchParams.get('isApproved') === 'false' ? false : undefined,
      searchTerm: searchParams.get('searchTerm') || undefined,
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
        start: searchParams.get('startDate')!,
        end: searchParams.get('endDate')!
      } : undefined
    };

    console.log('Applied filters:', JSON.stringify(filters, null, 2));

    // Fetch reviews from Hostaway API (or mock data)
    let reviews = await hostawayAPI.getReviews();
    console.log(`Fetched ${reviews.length} total reviews`);

    // Apply filters
    const originalCount = reviews.length;
    reviews = applyFilters(reviews, filters);
    console.log(`Filtered to ${reviews.length} reviews (from ${originalCount})`);

    // Calculate statistics
    const stats = calculateReviewStats(reviews);

    const processingTime = Date.now() - startTime;
    console.log(`API processing completed in ${processingTime}ms`);

    const response = {
      success: true,
      data: {
        reviews,
        stats,
        total: reviews.length,
        originalTotal: originalCount,
        processingTimeMs: processingTime
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: 'hostaway_api_with_mock_fallback',
        filters: filters,
        apiVersion: '1.0'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in Hostaway API route:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, updates } = body;

    if (!reviewId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Review ID and updates are required' },
        { status: 400 }
      );
    }

    console.log(`Updating review ${reviewId} with:`, updates);

    // In a real implementation, this would update the Hostaway API or database
    // For now, we'll simulate the update
    const allowedUpdates = ['isApproved', 'isDisplayed', 'tags', 'responseFromHost'];
    const validUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key));
    
    if (validUpdates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data: { 
        reviewId, 
        updates: Object.fromEntries(validUpdates.map(key => [key, updates[key]])),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update review',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Test endpoint for API connectivity
export async function POST(request: NextRequest) {
  try {
    const testResult = await hostawayAPI.testConnection();
    
    return NextResponse.json({
      success: true,
      message: 'Hostaway API test completed',
      data: testResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error testing Hostaway API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test Hostaway API',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function applyFilters(reviews: Review[], filters: FilterOptions): Review[] {
  return reviews.filter(review => {
    // Rating filter
    if (filters.rating && filters.rating.length > 0) {
      if (!filters.rating.includes(review.rating)) return false;
    }

    // Channel filter
    if (filters.channel && filters.channel.length > 0) {
      if (!filters.channel.includes(review.channel)) return false;
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(review.category)) return false;
    }

    // Approval status filter
    if (filters.isApproved !== undefined) {
      if (review.isApproved !== filters.isApproved) return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchableText = [
        review.guestName,
        review.comment,
        review.listingName,
        ...(review.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const reviewDate = new Date(review.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (reviewDate < startDate || reviewDate > endDate) return false;
    }

    return true;
  });
}

function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      channelBreakdown: {},
      categoryAverages: {},
      monthlyTrends: []
    };
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  // Rating distribution
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    const rating = Math.min(5, Math.max(1, review.rating)) as keyof typeof ratingDistribution;
    ratingDistribution[rating]++;
  });

  // Channel breakdown
  const channelBreakdown: Record<string, number> = {};
  reviews.forEach(review => {
    channelBreakdown[review.channel] = (channelBreakdown[review.channel] || 0) + 1;
  });

  // Category averages
  const categoryTotals: Record<string, { sum: number; count: number }> = {};
  reviews.forEach(review => {
    if (!categoryTotals[review.category]) {
      categoryTotals[review.category] = { sum: 0, count: 0 };
    }
    categoryTotals[review.category].sum += review.rating;
    categoryTotals[review.category].count++;
  });

  const categoryAverages: Record<string, number> = {};
  Object.keys(categoryTotals).forEach(category => {
    categoryAverages[category] = Math.round((categoryTotals[category].sum / categoryTotals[category].count) * 10) / 10;
  });

  // Monthly trends (last 12 months)
  const monthlyData: Record<string, { count: number; sum: number }> = {};
  
  reviews.forEach(review => {
    const reviewDate = new Date(review.date);
    const monthKey = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, sum: 0 };
    }
    monthlyData[monthKey].count++;
    monthlyData[monthKey].sum += review.rating;
  });

  const monthlyTrends = Object.keys(monthlyData)
    .sort()
    .slice(-12) // Last 12 months
    .map(month => ({
      month,
      count: monthlyData[month].count,
      averageRating: Math.round((monthlyData[month].sum / monthlyData[month].count) * 10) / 10
    }));

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    channelBreakdown,
    categoryAverages,
    monthlyTrends
  };
}
