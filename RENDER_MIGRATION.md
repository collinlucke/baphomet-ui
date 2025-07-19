# Baphomet UI Migration to Render

## Current Status ✅
- `collinlucke.com` → Already on Render ✅
- `baphomet-server.onrender.com` → Already on Render ✅
- `phantomartist` → GitHub Packages ✅

## Goal 🎯
Move `baphomet-ui` from Ionos Deploy Now to Render

## Step-by-Step Instructions

### 1. Create New Static Site on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your `baphomet-ui` repository
4. Configure the deployment:

```
Name: baphomet-ui
Build Command: pnpm install && pnpm run build
Publish Directory: dist
```

### 2. Set Environment Variables
In the Render dashboard, add these environment variables:

```
GIT_REGISTRY_TOKEN = [your GitHub personal access token]
GRAPHQL_BAPHOMET_SERVER_RENDER_URL = https://baphomet-server.onrender.com/graphql
```

### 3. Deploy and Test
- Wait for the build to complete
- Test the generated URL (will be something like `https://baphomet-ui-xyz.onrender.com`)
- Verify it loads and connects to your backend

### 4. Add Custom Domain (Optional)
If you want `baphomet.collinlucke.com`:
1. In Render dashboard → Custom Domains
2. Add `baphomet.collinlucke.com`
3. Follow DNS instructions to point your domain

### 5. Clean Up Ionos
Once working on Render:
- Remove `.ionos.yml` and `.deploy-now/` folder from repo
- Cancel the Ionos Deploy Now service

## Benefits After Migration
- ✅ All projects on one platform
- ✅ GitHub secrets work properly
- ✅ Free custom domains with SSL
- ✅ Unified dashboard and logs
- ✅ Same deployment patterns

## Troubleshooting

**Build fails?**
- Check that `GIT_REGISTRY_TOKEN` is set correctly
- Verify the token has packages:read permission

**App loads but can't connect to backend?**
- Check `GRAPHQL_BAPHOMET_SERVER_RENDER_URL` is correct
- Verify CORS is updated in backend (already done!)

**Need help?**
- Check build logs in Render dashboard
- Test individual components:
  - Backend: https://baphomet-server.onrender.com/health
  - GraphQL: https://baphomet-server.onrender.com/graphql
