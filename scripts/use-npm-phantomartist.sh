#!/bin/bash

# Switch to production phantomartist from NPM
echo "Switching to production phantomartist..."

# Update package.json to use NPM version
sed -i 's/"phantomartist": "file:..\/phantomartist"/"phantomartist": "latest"/' package.json

# Reinstall dependencies  
pnpm install

echo "✅ Now using production phantomartist from NPM"
echo "Ready for production build"