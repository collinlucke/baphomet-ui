#!/bin/bash

echo "Setting up Node environment..."
export NODE_VERSION=18
export NODE_ENV=production
export PATH="/opt/render/project/node/bin:$PATH"

echo "Installing pnpm..."
npm install -g pnpm@8

echo "Setting up .npmrc..."
echo "shamefully-hoist=true" > .npmrc
echo "strict-peer-dependencies=false" >> .npmrc

echo "Node version: $(node --version)"
echo "PNPM version: $(pnpm --version)"

echo "Installing dependencies..."
rm -f pnpm-lock.yaml
pnpm install --no-frozen-lockfile

echo "Starting build process..."
set -e
pnpm build

echo "Verifying build output..."
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found!"
  exit 1
fi
echo "Build output:"
ls -la dist/

rm -f .npmrc