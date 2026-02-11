#!/bin/bash

# Switch both athameui and phantomartist to production versions
echo "Switching both athameui and phantomartist to production..."

# Update package.json to use NPM versions
sed -i 's/"athameui": "[^"]*"/"athameui": "latest"/' package.json
sed -i 's/"phantomartist": "[^"]*"/"phantomartist": "latest"/' package.json
# sed -i 's/"@collinlucke\/phantomartist": "[^"]*"/"@collinlucke\/phantomartist": "^0.1.0"/' package.json

# Remove postinstall temporarily to avoid switching back to local
sed -i '/"postinstall": "pnpm use:local"/d' package.json

# Reinstall dependencies  
pnpm install

echo "✅ Now using production versions of both libraries"
echo "- athameui: latest (from npm)"
echo "- phantomartist: latest (from npm)"  
# echo "- @collinlucke/phantomartist: ^0.1.0 (from npm)"
echo "Note: postinstall script removed to prevent switching back to local"