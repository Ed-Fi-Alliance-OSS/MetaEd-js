import R from 'ramda';
import fs from 'fs-extra';
import path from 'path';

export const vscodeMetaEdPackageJson = R.memoizeWith(R.identity, () => {
  const packageJson = path.resolve(__dirname, '../../package.json');
  if (fs.existsSync(packageJson)) return fs.readJsonSync(packageJson);
  return null;
});

export const isDevEnvironment = R.memoizeWith(R.identity, () =>
  fs.existsSync(path.resolve(__dirname, '../../../../packages')),
);

export function devEnvironmentCorrectedPath(pathStartingWithPackageDirectory: string): string {
  return isDevEnvironment()
    ? path.resolve(__dirname, '../../../../node_modules', pathStartingWithPackageDirectory)
    : path.resolve(__dirname, '../../..', pathStartingWithPackageDirectory);
}

/**
 * Awaiting on this function in a microtask ends the microtask queue and allows the next macro task to run.
 * See https://medium.com/@mmoshikoo/event-loop-in-nodejs-visualized-235867255e81 for a visual
 * explanation of the role of microtasks Node event loop
 *
 * For example, this is useful inside UI event listeners that then make a UI modification, as those event listeners
 * are microtasks (more specifically they are Promise callbacks), yet the UI change itself is a macro task. Yielding
 * gives the UI the opportunity to complete its UI behavior before making a UI modification in the event listener.
 */
export const yieldToNextMacroTask = async (): Promise<void> => new Promise((resolve) => setImmediate(resolve));
