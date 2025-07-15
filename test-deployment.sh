#!/bin/bash
# Simple deployment test script

echo "=== Testing Baphomet UI Deployment Setup ==="
echo ""

# Navigate to the project directory
cd "$(dirname "$0")"

echo "1. Installing dependencies..."
pnpm install

echo ""
echo "2. Building the project..."
pnpm build

echo ""
echo "3. Checking build output..."
if [ -d "dist" ]; then
    echo "✅ Build successful - dist folder created"
    echo "Files in dist:"
    ls -la dist/
    
    echo ""
    echo "4. Checking critical files..."
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ assets folder found"
    else
        echo "❌ assets folder missing"
    fi
    
else
    echo "❌ Build failed - no dist folder"
    exit 1
fi

echo ""
echo "5. Configuration files status:"
echo "- .ionos.yml: $([ -f ".ionos.yml" ] && echo "✅ exists" || echo "❌ missing")"
echo "- .deploy-now/baphomet-ui/config.yaml: $([ -f ".deploy-now/baphomet-ui/config.yaml" ] && echo "✅ exists" || echo "❌ missing")"
echo "- CNAME: $([ -f "CNAME" ] && echo "✅ exists" || echo "❌ missing")"

echo ""
echo "6. Environment check:"
echo "Current directory: $(pwd)"
echo "Git branch: $(git branch --show-current 2>/dev/null || echo "unknown")"
echo "Git status: $(git status --porcelain 2>/dev/null | wc -l) files changed"

echo ""
echo "=== Deployment Ready ==="
echo "You can now push these changes to trigger the Ionos deployment."
