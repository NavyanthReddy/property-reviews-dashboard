'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Search, ExternalLink, DollarSign, Clock, Shield } from 'lucide-react';
import { mockProperties } from '@/data/mockReviews';

interface GoogleConfigInfo {
  isConfigured: boolean;
  requirements: string[];
  limitations: string[];
  costs: string[];
}

interface GoogleReviewsData {
  property: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  reviews: any[];
  count: number;
  source: string;
}

export default function GoogleReviewsPage() {
  const [configInfo, setConfigInfo] = useState<GoogleConfigInfo | null>(null);
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]);
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/google');
      const data = await response.json();
      
      setConfigInfo(data.configuration);
      if (!data.success && data.error) {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to check API configuration');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleReviews = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      setReviewsData(null);

      const response = await fetch(`/api/reviews/google?propertyId=${propertyId}`);
      const data = await response.json();

      if (data.success) {
        setReviewsData(data.data);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError('Network error while fetching Google reviews');
    } finally {
      setLoading(false);
    }
  };

  const testGooglePlacesAPI = async () => {
    try {
      setLoading(true);
      setTestResults(null);
      setError(null);

      const response = await fetch('/api/reviews/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyName: selectedProperty.name,
          propertyAddress: `${selectedProperty.address}, ${selectedProperty.city}`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.data);
      } else {
        setError(data.message || 'Test failed');
      }
    } catch (err) {
      setError('Network error during API test');
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Google Reviews Integration</h1>
                <p className="text-sm text-gray-500">
                  Explore Google Places API integration for comprehensive review management
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Status */}
        <div className="mb-8">
          <div className={`rounded-lg border-2 p-6 ${
            configInfo?.isConfigured 
              ? 'border-green-200 bg-green-50' 
              : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-start space-x-3">
              {configInfo?.isConfigured ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Google Places API Status
                </h3>
                <p className={`mb-4 ${
                  configInfo?.isConfigured ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {configInfo?.isConfigured 
                    ? 'Google Places API is configured and ready to use!'
                    : 'Google Places API is not configured. This is expected for the demo.'}
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Requirements and Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
            </div>
            <ul className="space-y-2">
              {configInfo?.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Limitations</h3>
            </div>
            <ul className="space-y-2">
              {configInfo?.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Costs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            </div>
            <ul className="space-y-2">
              {configInfo?.costs.map((cost, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testing Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Google Places API</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Property to Test
              </label>
              <select
                value={selectedProperty.id}
                onChange={(e) => {
                  const property = mockProperties.find(p => p.id === e.target.value);
                  if (property) setSelectedProperty(property);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {mockProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.city}
                  </option>
                ))}
              </select>
              
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {selectedProperty.address}, {selectedProperty.city}
                </p>
              </div>
            </div>

            {/* Test Actions */}
            <div className="space-y-4">
              <button
                onClick={testGooglePlacesAPI}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Testing...' : 'Test Place Search'}</span>
              </button>

              <button
                onClick={() => fetchGoogleReviews(selectedProperty.id)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{loading ? 'Fetching...' : 'Fetch Google Reviews'}</span>
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Test Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Place Found</div>
                  <div className={`font-semibold ${testResults.found ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.found ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Reviews Count</div>
                  <div className="font-semibold text-gray-900">{testResults.reviewsCount || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                  <div className="font-semibold text-gray-900">{testResults.rating || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Ratings</div>
                  <div className="font-semibold text-gray-900">{testResults.totalRatings || 0}</div>
                </div>
              </div>
              {testResults.placeId && (
                <div className="mt-3">
                  <div className="text-sm text-gray-600">Place ID</div>
                  <div className="text-xs text-gray-500 font-mono">{testResults.placeId}</div>
                </div>
              )}
            </div>
          )}

          {/* Reviews Data */}
          {reviewsData && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Fetched Reviews</h4>
              <div className="mb-3">
                <p className="text-sm text-gray-700">
                  Found <strong>{reviewsData.count}</strong> reviews for <strong>{reviewsData.property.name}</strong>
                </p>
                <p className="text-xs text-gray-500">Source: {reviewsData.source}</p>
              </div>
              
              {reviewsData.reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviewsData.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.guestName}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {reviewsData.reviews.length > 3 && (
                    <p className="text-sm text-gray-600">
                      ... and {reviewsData.reviews.length - 3} more reviews
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No reviews found for this property.</p>
              )}
            </div>
          )}
        </div>

        {/* Implementation Guide */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Guide</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Setup Google Cloud Project</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Create a Google Cloud Project</li>
                <li>Enable the Places API</li>
                <li>Create an API Key with Places API permissions</li>
                <li>Set up billing (required for Places API)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Configure Environment</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-gray-800">
                  GOOGLE_MAPS_API_KEY=your_api_key_here
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Integration Benefits</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Centralized review management across all platforms</li>
                <li>Better insights into guest satisfaction</li>
                <li>Automated review aggregation</li>
                <li>Enhanced property listings with comprehensive reviews</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Current Status</h4>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> The Google Places API integration is implemented but not configured 
                  with actual API credentials. This is intentional for the demo environment. In production, 
                  you would set up the API key and enable billing to access real Google Reviews data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
