'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/reviews';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { ArrowLeft, MapPin, Star, Wifi, Car, Utensils, Waves, Dumbbell, Calendar, Users, Home, ChevronDown, Search, Heart, Share, Grid3X3, Bed, Bath, Square, CheckCircle } from 'lucide-react';
import { mockProperties } from '@/data/mockReviews';

export default function PropertyPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [properties] = useState<Property[]>(mockProperties);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const amenityIcons = {
    'WiFi': Wifi,
    'Kitchen': Utensils,
    'Parking': Car,
    'Pool': Waves,
    'Gym Access': Dumbbell,
    'Washer/Dryer': Home,
    'Balcony': Home,
    'Workspace': Home,
    'Rooftop Access': Home
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Property images
  const propertyImages = [
    selectedProperty.imageUrl,
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Flex Living Style Header */}
      <header className="bg-flex-green shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              {/* Logo matching Flex Living style */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-flex-green font-bold text-lg">f</span>
                </div>
                <span className="text-white font-medium text-lg hidden sm:inline">the flex.</span>
              </Link>
            </div>

            {/* Navigation matching Flex Living */}
            <div className="flex items-center space-x-6 text-white">
              <Link href="/dashboard" className="hover:text-gray-200 transition-colors">Dashboard</Link>
              <select
                value={selectedProperty.id}
                onChange={(e) => {
                  const property = properties.find(p => p.id === e.target.value);
                  if (property) setSelectedProperty(property);
                }}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white/20 focus:border-white"
              >
                {properties.map(property => (
                  <option key={property.id} value={property.id} className="text-gray-900">
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-flex-green">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/property" className="hover:text-flex-green">Properties</Link>
          <span className="mx-2">→</span>
          <span className="text-gray-900">{selectedProperty.name}</span>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedProperty.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProperty.address}, {selectedProperty.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedProperty.averageRating)}
                  </div>
                  <span className="font-semibold">{selectedProperty.averageRating}</span>
                  <span>({selectedProperty.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery - Flex Living Style */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-96">
          <div className="col-span-2 row-span-2">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={propertyImages[currentImageIndex]}
                alt={selectedProperty.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 col-span-2">
            {propertyImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative h-full rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${selectedProperty.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-white">
                      <Grid3X3 className="w-4 h-4" />
                      <span className="font-medium">Show all photos</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Entire apartment hosted by Flex Living</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>4 guests</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>2 bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>2 bathrooms</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-flex-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedProperty.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || CheckCircle;
                  return (
                    <div key={index} className="flex items-center space-x-3 py-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card - Flex Living Style */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-2xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600">night</span>
                </div>

                {/* Booking Form */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 border border-gray-300 rounded-lg overflow-hidden">
                    <div className="p-3 border-r border-gray-300">
                      <label className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</label>
                      <input
                        type="date"
                        className="w-full text-sm text-gray-900 bg-transparent border-none focus:outline-none"
                        defaultValue="2024-12-01"
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">CHECKOUT</label>
                      <input
                        type="date"
                        className="w-full text-sm text-gray-900 bg-transparent border-none focus:outline-none"
                        defaultValue="2024-12-05"
                      />
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS</label>
                    <select className="w-full text-sm text-gray-900 bg-transparent border-none focus:outline-none">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option>3 guests</option>
                      <option>4 guests</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-flex-green text-white py-4 rounded-lg font-semibold hover:bg-flex-green-dark transition-colors mb-4">
                  Reserve
                </button>
                
                <p className="text-center text-sm text-gray-600 mb-6">You won't be charged yet</p>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>$299 × 4 nights</span>
                    <span>$1,196</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Service fee</span>
                    <span>$75</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>$1,321</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection 
          propertyId={selectedProperty.id} 
          propertyName={selectedProperty.name}
        />

        {/* Location Section */}
        <div className="py-12 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Where you'll be</h2>
          <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center mb-6">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Map integration would be implemented here</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{selectedProperty.city}</h3>
            <p className="text-gray-700">
              Located in the vibrant heart of {selectedProperty.city}, this property offers easy access to 
              restaurants, shopping, public transportation, and major attractions. Perfect for both 
              business and leisure travelers seeking a premium urban experience.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-flex-green rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">f</span>
              </div>
              <span className="text-gray-900 font-medium">the flex.</span>
            </div>
            <div className="text-center text-gray-500">
              <p>&copy; 2024 Flex Living. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
