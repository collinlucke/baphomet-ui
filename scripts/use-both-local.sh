#!/bin/bash

# Set up both athameui and phantomartist for local development
echo "Setting up local development for both athameui and phantomartist..."

# Update package.json to use local athameui
sed -i 's/"athameui": "[^"]*"/"athameui": "link:..\/athameui"/' package.json

# Update package.json to use local phantomartist (both entries)
sed -i 's/"phantomartist": "[^"]*"/"phantomartist": "file:..\/phantomartist"/' package.json
sed -i 's/"@collinlucke\/phantomartist": "[^"]*"/"@collinlucke\/phantomartist": "link:..\/phantomartist"/' package.json

# Add postinstall script back if not present
if ! grep -q '"postinstall"' package.json; then
    sed -i '/"install:prod": "bash scripts\/use-npm-phantomartist.sh"/a\    "postinstall": "pnpm use:local",' package.json
fi

# Reinstall dependencies
pnpm install

echo "✅ Now using local versions of BOTH athameui and phantomartist"
echo "- athameui: link:../athameui"  
echo "- phantomartist: file:../phantomartist"
echo "- @collinlucke/phantomartist: link:../phantomartist"
echo "Run 'pnpm dev' to start development with both local libraries"