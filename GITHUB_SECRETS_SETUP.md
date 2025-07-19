# GitHub Secrets → Render Deployment Guide

## The Problem
You want to use GitHub Secrets for sensitive data (like `GIT_REGISTRY_TOKEN`) but not duplicate them in multiple places.

## Recommended Solution: GitHub Actions + Render Deploy Hook

This approach keeps all secrets in GitHub and uses Actions to build with those secrets, then triggers Render deployment.

### Step 1: Set up Render Static Site (without env vars)
1. Create static site in Render for `baphomet-ui`
2. **Don't set any environment variables in Render**
3. Set build command to: `echo "Built by GitHub Actions"`
4. Set publish directory to: `dist`

### Step 2: Get Render Deploy Hook
1. In your Render service settings
2. Go to "Settings" → "Deploy Hook"
3. Copy the webhook URL (looks like `https://api.render.com/deploy/srv-xxx?key=yyy`)

### Step 3: Add GitHub Secrets
In your GitHub repository secrets, add:
```
GIT_REGISTRY_TOKEN = [your existing token]
RENDER_DEPLOY_HOOK = [the webhook URL from step 2]
```

### Step 4: How It Works
1. **Push to main branch** → GitHub Actions triggers
2. **Actions builds** using your GitHub secrets (including `GIT_REGISTRY_TOKEN`)
3. **Actions calls Render webhook** → Render pulls latest code and deploys
4. **No secrets stored in Render** ✅

### Benefits
- ✅ Secrets only stored in GitHub
- ✅ GitHub Actions has full access to your packages
- ✅ Render automatically deploys when build succeeds
- ✅ No duplication of sensitive data
- ✅ Can use all GitHub features (branch protection, etc.)

### Alternative: Environment Sync Script
If you prefer to sync secrets to Render, use the `scripts/sync-env-to-render.js` script:

```bash
# Set these locally once
export RENDER_API_KEY="your_render_api_key"
export RENDER_SERVICE_ID="your_render_service_id" 
export GIT_REGISTRY_TOKEN="your_github_token"

# Run the sync script
node scripts/sync-env-to-render.js
```

### For Your Backend Server
Your `baphomet-server` can continue using Render environment variables since it doesn't need GitHub package access.

## Setup Commands

```bash
# 1. Commit the new workflow
git add .github/workflows/deploy-render.yml
git commit -m "Add GitHub Actions → Render deployment"

# 2. Add the GitHub secrets in your repo settings
# (RENDER_DEPLOY_HOOK and GIT_REGISTRY_TOKEN)

# 3. Push to trigger first deployment
git push origin main
```

The first deployment will fail if the secrets aren't set up yet, but subsequent ones will work perfectly!
