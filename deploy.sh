#!/bin/bash

# Flex Living Reviews Dashboard - Netlify Deployment Script

echo "🚀 Starting Netlify deployment process..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=.next

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your Flex Living Reviews Dashboard is now live on Netlify!"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
