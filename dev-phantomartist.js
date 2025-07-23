import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const phantomArtistPath = path.resolve('../phantomartist');
const baphometUIPath = process.cwd();

console.log('🎭 PhantomArtist Development Setup');
console.log('=====================================');

// Check if PhantomArtist exists
if (!fs.existsSync(phantomArtistPath)) {
  console.error('❌ PhantomArtist not found at ../phantomartist');
  console.log(
    'Please ensure the PhantomArtist repository is cloned at the same level as baphomet-ui'
  );
  process.exit(1);
}

// Check if PhantomArtist has dependencies installed
const phantomArtistNodeModules = path.join(phantomArtistPath, 'node_modules');
if (!fs.existsSync(phantomArtistNodeModules)) {
  console.log('📦 Installing PhantomArtist dependencies...');
  try {
    execSync('pnpm install', {
      stdio: 'inherit',
      cwd: phantomArtistPath
    });
  } catch (error) {
    console.error('❌ Failed to install PhantomArtist dependencies');
    process.exit(1);
  }
}

// Build PhantomArtist
console.log('🔨 Building PhantomArtist...');
try {
  execSync('pnpm run build', {
    stdio: 'inherit',
    cwd: phantomArtistPath
  });
  console.log('✅ PhantomArtist built successfully');
} catch (error) {
  console.error('❌ Failed to build PhantomArtist');
  process.exit(1);
}

// Setup watch mode for PhantomArtist (optional)
const args = process.argv.slice(2);
if (args.includes('--watch')) {
  console.log('👀 Starting PhantomArtist in watch mode...');
  console.log('   This will rebuild PhantomArtist when files change');
  console.log('   Run baphomet-ui in another terminal with: pnpm dev:local');

  try {
    execSync('pnpm run dev', {
      stdio: 'inherit',
      cwd: phantomArtistPath
    });
  } catch (error) {
    console.error('❌ PhantomArtist watch mode failed');
  }
} else {
  console.log('');
  console.log('🚀 Setup complete! You can now:');
  console.log('   1. Run: pnpm dev:local (to use local PhantomArtist)');
  console.log(
    '   2. Run: node dev-phantomartist.js --watch (to auto-rebuild PhantomArtist)'
  );
  console.log('   3. Run: pnpm dev:prod (to use published PhantomArtist)');
}
