/* eslint-disable no-console */

import { execSync } from 'child_process';

console.info('Command arguments: ', process.argv);

try {
  execSync('npm install @edfi/metaed-console@dev --loglevel error');
} catch (err) {
  console.error('Exception occurred during npm install atom-metaed:');
  console.error('--> stdout', err);
  console.error('--> sdterr', err.stderr.toString());
}

// Implicitly calls the deploy process
// eslint-disable-next-line import/no-extraneous-dependencies
await import('@edfi/metaed-console');
