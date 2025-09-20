import { Review, Property } from '@/types/reviews';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Downtown Luxury Loft',
    address: '123 Main St',
    city: 'San Francisco',
    averageRating: 4.8,
    totalReviews: 127,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Parking', 'Pool'],
    description: 'Stunning downtown loft with panoramic city views, modern amenities, and prime location.'
  },
  {
    id: '2',
    name: 'Cozy Marina Apartment',
    address: '456 Harbor Blvd',
    city: 'San Francisco',
    averageRating: 4.6,
    totalReviews: 89,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    amenities: ['WiFi', 'Kitchen', 'Balcony', 'Gym Access'],
    description: 'Charming apartment near the marina with beautiful water views and easy access to restaurants.'
  },
  {
    id: '3',
    name: 'Modern SoMa Studio',
    address: '789 Tech Way',
    city: 'San Francisco',
    averageRating: 4.4,
    totalReviews: 56,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    amenities: ['WiFi', 'Kitchen', 'Workspace', 'Rooftop Access'],
    description: 'Contemporary studio in the heart of SoMa, perfect for business travelers and tech professionals.'
  }
];

export const mockReviews: Review[] = [
  // Downtown Luxury Loft Reviews
  {
    id: '1',
    listingId: '1',
    listingName: 'Downtown Luxury Loft',
    guestName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely stunning property! The views are incredible and the location is perfect. Everything was spotless and the host was very responsive. Would definitely stay here again.',
    date: '2024-01-15T10:30:00Z',
    channel: 'airbnb',
    category: 'overall',
    isApproved: true,
    isDisplayed: true,
    responseFromHost: 'Thank you so much Sarah! We\'re thrilled you enjoyed your stay.',
    responseDate: '2024-01-16T09:15:00Z',
    tags: ['cleanliness', 'location', 'views']
  },
  {
    id: '2',
    listingId: '1',
    listingName: 'Downtown Luxury Loft',
    guestName: 'Michael Chen',
    rating: 4,
    comment: 'Great location and beautiful space. The only minor issue was the noise from the street at night, but overall a fantastic stay.',
    date: '2024-01-10T14:20:00Z',
    channel: 'booking',
    category: 'location',
    isApproved: true,
    isDisplayed: true,
    tags: ['location', 'noise']
  },
  {
    id: '3',
    listingId: '1',
    listingName: 'Downtown Luxury Loft',
    guestName: 'Emily Rodriguez',
    rating: 5,
    comment: 'Perfect for our business trip. The workspace setup was excellent and check-in was seamless.',
    date: '2024-01-08T16:45:00Z',
    channel: 'direct',
    category: 'checkin',
    isApproved: true,
    isDisplayed: true,
    tags: ['business', 'workspace', 'checkin']
  },
  {
    id: '4',
    listingId: '1',
    listingName: 'Downtown Luxury Loft',
    guestName: 'David Park',
    rating: 3,
    comment: 'The apartment was nice but had some cleanliness issues. The bathroom could have been better maintained.',
    date: '2024-01-05T11:30:00Z',
    channel: 'vrbo',
    category: 'cleanliness',
    isApproved: false,
    isDisplayed: false,
    tags: ['cleanliness', 'maintenance']
  },
  
  // Cozy Marina Apartment Reviews
  {
    id: '5',
    listingId: '2',
    listingName: 'Cozy Marina Apartment',
    guestName: 'Lisa Thompson',
    rating: 5,
    comment: 'Amazing waterfront location! The apartment was cozy and had everything we needed. The host provided excellent local recommendations.',
    date: '2024-01-12T09:15:00Z',
    channel: 'airbnb',
    category: 'overall',
    isApproved: true,
    isDisplayed: true,
    responseFromHost: 'So happy you enjoyed the marina views Lisa! Thanks for being a wonderful guest.',
    responseDate: '2024-01-13T08:00:00Z',
    tags: ['location', 'recommendations', 'waterfront']
  },
  {
    id: '6',
    listingId: '2',
    listingName: 'Cozy Marina Apartment',
    guestName: 'James Wilson',
    rating: 4,
    comment: 'Good value for money. The location is excellent for walking and the apartment was clean and comfortable.',
    date: '2024-01-07T13:20:00Z',
    channel: 'booking',
    category: 'value',
    isApproved: true,
    isDisplayed: true,
    tags: ['value', 'walking', 'comfortable']
  },
  {
    id: '7',
    listingId: '2',
    listingName: 'Cozy Marina Apartment',
    guestName: 'Anna Martinez',
    rating: 4,
    comment: 'Lovely apartment with great views. Communication with the host was excellent throughout our stay.',
    date: '2024-01-03T15:45:00Z',
    channel: 'direct',
    category: 'communication',
    isApproved: true,
    isDisplayed: true,
    tags: ['views', 'communication', 'host']
  },
  
  // Modern SoMa Studio Reviews
  {
    id: '8',
    listingId: '3',
    listingName: 'Modern SoMa Studio',
    guestName: 'Robert Kim',
    rating: 5,
    comment: 'Perfect for a business trip. Great workspace setup and super fast WiFi. Location is ideal for accessing downtown.',
    date: '2024-01-14T12:00:00Z',
    channel: 'airbnb',
    category: 'overall',
    isApproved: true,
    isDisplayed: true,
    tags: ['business', 'workspace', 'wifi', 'downtown']
  },
  {
    id: '9',
    listingId: '3',
    listingName: 'Modern SoMa Studio',
    guestName: 'Jennifer Lee',
    rating: 4,
    comment: 'Clean and modern studio with good amenities. The building has nice facilities and the check-in process was smooth.',
    date: '2024-01-09T10:30:00Z',
    channel: 'vrbo',
    category: 'checkin',
    isApproved: true,
    isDisplayed: true,
    tags: ['modern', 'amenities', 'facilities']
  },
  {
    id: '10',
    listingId: '3',
    listingName: 'Modern SoMa Studio',
    guestName: 'Mark Davis',
    rating: 3,
    comment: 'The studio was okay but felt a bit cramped for two people. Location is good though.',
    date: '2024-01-06T14:15:00Z',
    channel: 'booking',
    category: 'accuracy',
    isApproved: false,
    isDisplayed: false,
    tags: ['space', 'cramped', 'location']
  },
  
  // Additional reviews for better data variety
  {
    id: '11',
    listingId: '1',
    listingName: 'Downtown Luxury Loft',
    guestName: 'Sophie Brown',
    rating: 5,
    comment: 'Exceptional stay! The loft exceeded all expectations. Beautiful design, perfect location, and the host went above and beyond.',
    date: '2023-12-28T16:20:00Z',
    channel: 'airbnb',
    category: 'overall',
    isApproved: true,
    isDisplayed: true,
    tags: ['design', 'expectations', 'host']
  },
  {
    id: '12',
    listingId: '2',
    listingName: 'Cozy Marina Apartment',
    guestName: 'Tom Anderson',
    rating: 2,
    comment: 'The apartment had some maintenance issues and the WiFi was unreliable. The location was the only redeeming factor.',
    date: '2023-12-25T11:45:00Z',
    channel: 'vrbo',
    category: 'overall',
    isApproved: false,
    isDisplayed: false,
    tags: ['maintenance', 'wifi', 'issues']
  }
];

// Helper function to generate additional mock reviews
export const generateAdditionalReviews = (count: number): Review[] => {
  const names = ['Alex Smith', 'Jordan Taylor', 'Casey Johnson', 'Riley Davis', 'Morgan Wilson'];
  const channels: Review['channel'][] = ['airbnb', 'booking', 'vrbo', 'direct'];
  const categories: Review['category'][] = ['overall', 'cleanliness', 'communication', 'location', 'value'];
  const comments = [
    'Great stay overall, would recommend!',
    'Clean and comfortable accommodation.',
    'Perfect location for our needs.',
    'Host was very responsive and helpful.',
    'Good value for the price point.',
    'Beautiful property with excellent amenities.',
    'Had a wonderful time, thank you!',
    'Everything was as described, very satisfied.'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `review-${index + 13}`,
    listingId: mockProperties[index % mockProperties.length].id,
    listingName: mockProperties[index % mockProperties.length].name,
    guestName: names[index % names.length],
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: comments[index % comments.length],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    channel: channels[index % channels.length],
    category: categories[index % categories.length],
    isApproved: Math.random() > 0.2, // 80% approved
    isDisplayed: Math.random() > 0.3, // 70% displayed
    tags: []
  }));
};
