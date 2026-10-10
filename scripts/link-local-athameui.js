import { existsSync, lstatSync, symlinkSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const localPackage = resolve('..', 'athameui');

if (!existsSync(resolve(localPackage, 'package.json'))) {
  process.exit(0);
}

const destination = resolve('node_modules', 'athameui');

if (existsSync(destination)) {
  unlinkSync(destination);
}

symlinkSync(
  localPackage,
  destination,
  process.platform === 'win32' ? 'junction' : 'dir'
);

const linked = lstatSync(destination);
if (!linked.isSymbolicLink()) {
  throw new Error('athameui link was not created');
}
