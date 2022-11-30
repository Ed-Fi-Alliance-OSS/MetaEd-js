import R from 'ramda';
import fs from 'fs-extra';
import path from 'path';

export const atomMetaEdPackageJson = R.memoizeWith(R.identity, () => {
  const packageJson = path.resolve(__dirname, '../package.json');
  if (fs.existsSync(packageJson)) return fs.readJsonSync(packageJson);
  return null;
});

export const isDevEnvironment = R.memoizeWith(R.identity, () => fs.existsSync(path.resolve(__dirname, '../../../packages')));

export function devEnvironmentCorrectedPath(pathStartingWithPackageDirectory: string): string {
  return isDevEnvironment()
    ? path.resolve(__dirname, '../../../node_modules', pathStartingWithPackageDirectory)
    : path.resolve(__dirname, '../..', pathStartingWithPackageDirectory);
}

export const nextMacroTask = async (): Promise<void> => new Promise((resolve) => setImmediate(resolve));
