# Deployment Guide for Render

## Prerequisites
- GitHub repository: `Mpomkar/shopify-frontend`
- Render account (free tier available)

## Deployment Steps

### 1. Connect Repository to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub account if not already connected
4. Select repository: `Mpomkar/shopify-frontend`

### 2. Configure Static Site

Fill in the following settings:

- **Name**: `shopify-frontend` (or your preferred name)
- **Branch**: `main` (or `master` if that's your default branch)
- **Root Directory**: `shopify` ⚠️ **Important: Set this to `shopify`**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3. Environment Variables

Add the following environment variable:

- **Key**: `VITE_API_URL`
- **Value**: `https://react-frontend-9wcj.onrender.com`

### 4. Deploy

Click **"Create Static Site"** and wait for the build to complete.

### 5. Access Your Site

Once deployed, your site will be available at:
`https://shopify-frontend.onrender.com` (or your custom name)

## Auto-Deployment

Render will automatically redeploy your site whenever you push changes to the connected branch (main/master).

## Troubleshooting

- **Build fails**: Check build logs in Render dashboard
- **API not working**: Verify `VITE_API_URL` environment variable is set correctly
- **404 errors**: Ensure `Publish Directory` is set to `dist`

## Notes

- The backend API is already deployed at: `https://react-frontend-9wcj.onrender.com`
- Make sure CORS is enabled on your backend to allow requests from your Render frontend URL
