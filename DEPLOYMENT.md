# Flex Living Reviews Dashboard - Netlify Deployment Guide

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Push your code to GitHub
3. **API Keys**: Have your API keys ready for configuration

## Deployment Options

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
     - **Node version**: `18`

3. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_HOSTAWAY_ACCOUNT_ID=61148
     HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
     GOOGLE_PLACES_API_KEY=your-google-places-api-key
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option 2: Manual Deploy with Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

### Option 3: Drag & Drop Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Zip the .next folder**:
   - Compress the `.next` folder
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the zip file

## Configuration Files

The following files are already configured for Netlify deployment:

- **`netlify.toml`**: Netlify configuration with build settings and redirects
- **`next.config.js`**: Next.js configuration optimized for deployment
- **`package.json`**: Updated with deployment scripts

## Environment Variables

Set these in Netlify dashboard → Site settings → Environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_HOSTAWAY_ACCOUNT_ID` | `61148` | Hostaway account ID |
| `HOSTAWAY_API_KEY` | `f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152` | Hostaway API key |
| `GOOGLE_PLACES_API_KEY` | `your-key-here` | Google Places API key (optional) |

## Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow the DNS configuration instructions

2. **SSL Certificate**:
   - Netlify automatically provides SSL certificates
   - HTTPS will be enabled by default

## Post-Deployment

1. **Test Your Site**:
   - Visit your Netlify URL
   - Test all pages: `/`, `/dashboard`, `/property`, `/google-reviews`
   - Test API endpoints: `/api/reviews/hostaway`, `/api/reviews/google`

2. **Monitor Performance**:
   - Check Netlify dashboard for build logs
   - Monitor function execution in the Functions tab
   - Review analytics in the Analytics tab

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version (should be 18)
   - Verify all dependencies are in package.json
   - Check build logs in Netlify dashboard

2. **API Routes Not Working**:
   - Ensure environment variables are set
   - Check function logs in Netlify dashboard
   - Verify API endpoints are accessible

3. **Environment Variables Not Loading**:
   - Make sure variables are set in Netlify dashboard
   - Variables starting with `NEXT_PUBLIC_` are available on client-side
   - Server-side variables don't need the prefix

### Support:

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Environment variables configured
- [ ] Build successful
- [ ] All pages accessible
- [ ] API endpoints working
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active

Your Flex Living Reviews Dashboard should now be live on Netlify! 🚀
