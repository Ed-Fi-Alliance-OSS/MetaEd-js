/** @babel */
// @flow
import R from 'ramda';
import fs from 'fs-extra';
import path from 'path';

export const isDevEnvironment = R.memoize(() => fs.existsSync(path.resolve(__dirname, '../../../packages')));

export function devEnviromentCorrectedPath(pathStartingWithPackageDirectory: string): string {
  return isDevEnvironment()
    ? path.resolve(__dirname, '../../../node_modules', pathStartingWithPackageDirectory)
    : path.resolve(__dirname, '../..', pathStartingWithPackageDirectory);
}

export const nextMacroTask = (): Promise<void> => new Promise(resolve => setImmediate(resolve));
