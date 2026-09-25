#!/bin/bash

# Switch to local athameui for development
echo "Switching to local athameui development..."

# Update package.json to use local file reference
sed -i 's/"athameui": "[^"]*"/"athameui": "link:..\/athameui"/' package.json

# Add postinstall script back if not present
if ! grep -q '"postinstall"' package.json; then
    sed -i '/"install:prod": "bash scripts\/use-npm-phantomartist.sh"/a\    "postinstall": "pnpm use:local",' package.json
fi

# Reinstall dependencies
pnpm install

echo "✅ Now using local athameui development setup"
echo "Run 'pnpm dev' to start development with local athameui"