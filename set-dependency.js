import fs from 'fs';
import { execSync } from 'child_process';
import packageJson from './package.json' with { type: 'json' };
import 'dotenv/config';

const isDevelopment = process.env.NODE_ENV === 'development';
console.log('isDevelopment -> ' + isDevelopment);

if (isDevelopment) {
  packageJson.dependencies['@collinlucke/phantomartist'] =
    'link:../phantomartist';
} else {
  packageJson.dependencies['@collinlucke/phantomartist'] =
    'latest';
}

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

// Install @collinlucke/phantomartist here because it doesn't actually install when `pnpm install`
// runs.
if (isDevelopment) {
  execSync('pnpm install @collinlucke/phantomartist', { stdio: 'inherit' });
}