#!/bin/bash

# Switch to production athameui from NPM
echo "Switching to production athameui..."

# Update package.json to use NPM version
sed -i 's/"athameui": "[^"]*"/"athameui": "^0.0.2"/' package.json

# Remove postinstall temporarily to avoid switching back to local
sed -i '/"postinstall": "pnpm use:local"/d' package.json

# Reinstall dependencies  
pnpm install

echo "✅ Now using production athameui from NPM"
echo "Note: postinstall script removed to prevent switching back to local"
echo "Run 'pnpm install:athame:dev' to switch back to local development"