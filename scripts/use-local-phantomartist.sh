#!/bin/bash

# Switch to local phantomartist for development
echo "Switching to local phantomartist development..."

# Update package.json to use local file reference
sed -i 's/"phantomartist": "[^"]*"/"phantomartist": "file:..\/phantomartist"/' package.json

# Reinstall dependencies
pnpm install

echo "✅ Now using local phantomartist development setup"
echo "Run 'pnpm dev' to start development with local phantomartist"