import { loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import packageJson from './package.json' with { type: 'json' };

// Parse command line arguments
const args = process.argv.slice(2);
const forceLocal = args.includes('--local');
const forceProd = args.includes('--prod');

// Load environment variables
const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '');

// Determine if we should use local PhantomArtist
let useLocalPhantomArtist = false;

if (forceLocal) {
  useLocalPhantomArtist = true;
  console.log('🔧 Forcing local PhantomArtist setup...');
} else if (forceProd) {
  useLocalPhantomArtist = false;
  console.log('🌐 Forcing production PhantomArtist setup...');
} else {
  // Auto-detect based on environment
  useLocalPhantomArtist = env.VITE_USE_LOCAL_PHANTOMARTIST === 'true' || 
                          env.VITE_NODE_ENV === 'development' ||
                          mode === 'development';
  console.log(`🔍 Auto-detected ${useLocalPhantomArtist ? 'local' : 'production'} PhantomArtist setup based on environment...`);
}

// Path to the local phantomartist directory
const phantomArtistPath = path.resolve('../phantomartist');
const phantomArtistExists = fs.existsSync(phantomArtistPath);

if (useLocalPhantomArtist && !phantomArtistExists) {
  console.warn('⚠️  Local PhantomArtist path not found at ../phantomartist');
  console.warn('⚠️  Falling back to production package...');
  useLocalPhantomArtist = false;
}

// Update package.json dependency
const originalDependency = packageJson.dependencies['@collinlucke/phantomartist'];

if (useLocalPhantomArtist) {
  packageJson.dependencies['@collinlucke/phantomartist'] = 'link:../phantomartist';
  console.log('📦 Updated package.json to use local PhantomArtist');
} else {
  packageJson.dependencies['@collinlucke/phantomartist'] = 'latest';
  console.log('📦 Updated package.json to use published PhantomArtist');
}

// Only write if there's a change
if (originalDependency !== packageJson.dependencies['@collinlucke/phantomartist']) {
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Package.json updated successfully');
  
  // Reinstall the dependency
  try {
    console.log('📥 Installing PhantomArtist dependency...');
    execSync('pnpm install @collinlucke/phantomartist', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ PhantomArtist dependency installed successfully');
  } catch (error) {
    console.error('❌ Failed to install PhantomArtist dependency:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Package.json already correctly configured');
}

// If using local PhantomArtist, ensure it's built
if (useLocalPhantomArtist && phantomArtistExists) {
  try {
    console.log('🔨 Building local PhantomArtist...');
    execSync('pnpm run build', { 
      stdio: 'inherit',
      cwd: phantomArtistPath 
    });
    console.log('✅ Local PhantomArtist built successfully');
  } catch (error) {
    console.warn('⚠️  Failed to build local PhantomArtist:', error.message);
    console.warn('⚠️  You may need to build it manually with: cd ../phantomartist && pnpm run build');
  }
}

console.log(`🚀 Setup complete! Using ${useLocalPhantomArtist ? 'local' : 'production'} PhantomArtist`);
