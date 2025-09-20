# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to http://localhost:3000

## Environment Variables (Optional)

Create a `.env.local` file in the root directory if you want to test Google Reviews integration:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Application URLs

- **Homepage**: http://localhost:3000
- **Manager Dashboard**: http://localhost:3000/dashboard
- **Property Display**: http://localhost:3000/property
- **Google Reviews Integration**: http://localhost:3000/google-reviews

## Key Features to Test

### Manager Dashboard
- Filter reviews by rating, channel, category, date range
- Search through reviews
- Approve/reject reviews
- Toggle display status for approved reviews
- Export reviews to CSV
- View analytics and statistics

### Property Display
- See approved reviews in a guest-facing format
- Filter reviews by rating and channel
- View rating distribution
- Responsive design for mobile/desktop

### Google Reviews Integration
- Check API configuration status
- Test Google Places API connectivity
- View implementation requirements and costs
- Understand limitations and recommendations

## Mock Data

The application includes comprehensive mock data:
- 3 sample properties in San Francisco
- 32+ reviews across different channels
- Mix of approved/pending reviews
- Various ratings and categories
- Sample host responses and tags

## API Endpoints

### Hostaway Reviews
- `GET /api/reviews/hostaway` - Fetch and filter reviews
- `PATCH /api/reviews/hostaway` - Update review status

### Google Reviews
- `GET /api/reviews/google` - Check config and fetch reviews
- `POST /api/reviews/google` - Test API connectivity

## Troubleshooting

### Common Issues
1. **Port already in use**: Try `npm run dev -- --port 3001`
2. **Build errors**: Run `npm run build` to check for issues
3. **TypeScript errors**: Ensure all dependencies are installed

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Production Deployment

For production deployment:
1. Set up environment variables
2. Configure Google Places API (if needed)
3. Run `npm run build`
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

The application is ready for deployment with no additional configuration needed.
