# 🐙 GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in
2. **Create New Repository**: 
   - Click the "+" icon in the top right
   - Select "New repository"
3. **Repository Settings**:
   - **Repository name**: `flex-living-reviews-dashboard`
   - **Description**: `Flex Living Reviews Dashboard - Manager tool for property review management`
   - **Visibility**: Choose Public or Private
   - **Initialize**: ❌ Don't initialize with README, .gitignore, or license (we already have these)
4. **Click "Create repository"**

### Option B: Using GitHub CLI (if installed)

```bash
# Install GitHub CLI if not already installed
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create flex-living-reviews-dashboard --public --description "Flex Living Reviews Dashboard - Manager tool for property review management"
```

## Step 2: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see instructions. Run these commands:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/flex-living-reviews-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify Repository

1. **Check GitHub**: Visit your repository URL
2. **Verify Files**: Ensure all files are uploaded correctly
3. **Check .gitignore**: Make sure `node_modules` and other files are not uploaded

## Step 4: Connect to Netlify

1. **Go to Netlify**: Visit [netlify.com](https://netlify.com)
2. **New Site from Git**: Click "New site from Git"
3. **Choose GitHub**: Select GitHub and authorize Netlify
4. **Select Repository**: Choose `flex-living-reviews-dashboard`
5. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`
6. **Environment Variables**: Add the variables listed below
7. **Deploy**: Click "Deploy site"

## 🔧 Environment Variables for Netlify

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
```

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Local repository connected to GitHub
- [ ] Code pushed to GitHub successfully
- [ ] Netlify connected to GitHub repository
- [ ] Build settings configured correctly
- [ ] Environment variables set in Netlify
- [ ] Site deployed successfully
- [ ] All pages working (/, /dashboard, /property, /google-reviews)
- [ ] API endpoints working (/api/reviews/hostaway)

## 🚀 Your Live URLs

After deployment:
- **Netlify URL**: `https://your-site-name.netlify.app`
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/flex-living-reviews-dashboard`

## 🔄 Future Updates

After making changes to your code:

```bash
# Make changes to your code
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Netlify will automatically rebuild and deploy
```

---

**Ready to create your GitHub repository!** 🎉
