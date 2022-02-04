/* eslint-disable no-console */

import { execSync } from 'child_process';

console.info('Command arguments: ', process.argv);

try {
  execSync('npm install atom-metaed@dev');
} catch (err) {
  console.error('Exception occurred during npm install atom-metaed:');
  console.error('--> stdout', err);
  console.error('--> sdterr', err.stderr.toString());
}

// Implicitly calls the deploy process
await import('@edfi/metaed-odsapi-deploy');
