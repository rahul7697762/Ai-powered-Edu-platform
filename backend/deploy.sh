#!/bin/bash

# AI-Powered Education Platform Backend Deployment Script

echo "🚀 Deploying AI-Powered Education Platform Backend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Update your frontend API URLs to use the new Vercel URL"
echo "   2. Set up environment variables in Vercel dashboard if needed"
echo "   3. Configure CORS origins for your frontend domain"