#!/bin/bash
# Local deployment verification script

echo "=== Baphomet UI Deployment Verification ==="
echo ""

echo "1. Building project locally..."
cd "$(dirname "$0")"
pnpm install
pnpm run build

echo ""
echo "2. Checking dist folder contents..."
ls -la dist/

echo ""
echo "3. Verifying index.html exists..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
fi

echo ""
echo "4. Checking for assets..."
if [ -d "dist/assets" ]; then
    echo "✅ Assets folder found"
    ls -la dist/assets/ | head -5
else
    echo "❌ Assets folder missing"
fi

echo ""
echo "5. Testing local server..."
echo "You can test locally by running: npx serve dist"
echo ""
echo "=== Deployment Configuration Check ==="
echo "Config files:"
echo "- .deploy-now/config.yaml"
echo "- .deploy-now/baphomet-ui/config.yaml" 
echo "- .ionos.yml"
echo ""
echo "Custom domain: baphomet.collinlucke.com"
echo "Ionos subdomain: home-5018222688.app-ionos.space"
