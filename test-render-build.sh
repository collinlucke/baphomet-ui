#!/bin/bash
# Simple script to test Render build steps locally

echo "Setting up environment..."
export NODE_ENV=production

echo "Installing dependencies..."
rm -f pnpm-lock.yaml
pnpm install --no-frozen-lockfile

echo "Starting build process..."
pnpm build

echo "Verifying build output..."
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found!"
  exit 1
fi
echo "Build output:"
ls -la dist/