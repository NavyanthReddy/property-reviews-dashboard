import Link from 'next/link';
import { Star, BarChart3, Eye, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flex-light to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-flex-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flex Living</h1>
                <p className="text-sm text-gray-500">Reviews Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Reviews Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor, manage, and showcase guest reviews across all your properties. 
            Make data-driven decisions to improve guest satisfaction.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link href="/dashboard" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-flex-green" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Manager Dashboard
              </h3>
              <p className="text-gray-600 mb-4">
                View analytics, filter reviews, and manage approval status across all properties.
              </p>
              <div className="text-flex-green font-medium group-hover:text-green-700">
                Open Dashboard →
              </div>
            </div>
          </Link>

          <Link href="/property" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Property Display
              </h3>
              <p className="text-gray-600 mb-4">
                See how approved reviews appear on your property listing pages.
              </p>
              <div className="text-flex-green font-medium group-hover:text-green-700">
                View Properties →
              </div>
            </div>
          </Link>

          <Link href="/google-reviews" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Google Reviews
              </h3>
              <p className="text-gray-600 mb-4">
                Integration with Google Places API for comprehensive review management.
              </p>
              <div className="text-flex-green font-medium group-hover:text-green-700">
                Explore Integration →
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-flex-green mb-2">127</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4.6</div>
              <div className="text-gray-600 flex items-center justify-center">
                Average Rating
                <Star className="w-4 h-4 text-yellow-400 ml-1 fill-current" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <div className="text-gray-600">Approval Rate</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built for Flex Living property management team
          </p>
        </div>
      </main>
    </div>
  );
}
