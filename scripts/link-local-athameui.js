import {
  existsSync,
  lstatSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync
} from 'node:fs';
import { resolve } from 'node:path';

const localPackage = resolve('..', 'athameui');

if (!existsSync(resolve(localPackage, 'package.json'))) {
  process.exit(0);
}

const destination = resolve('node_modules', 'athameui');

if (existsSync(destination)) {
  const current = lstatSync(destination);
  if (current.isSymbolicLink()) {
    unlinkSync(destination);
  } else {
    try {
      unlinkSync(destination);
    } catch (error) {
      if (!['EISDIR', 'EPERM', 'ENOTEMPTY'].includes(error.code)) {
        throw error;
      }
      rmSync(destination, { recursive: true, force: true });
    }
  }
}

symlinkSync(
  localPackage,
  destination,
  process.platform === 'win32' ? 'junction' : 'dir'
);

const samePath = (left, right) =>
  process.platform === 'win32'
    ? left.toLowerCase() === right.toLowerCase()
    : left === right;

if (!samePath(realpathSync(destination), realpathSync(localPackage))) {
  throw new Error('athameui link was not created');
}
