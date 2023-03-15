/* eslint-disable no-console */
console.info('Command arguments: ', process.argv);

// Implicitly calls the deploy process
// eslint-disable-next-line import/no-extraneous-dependencies
await import('@edfi/metaed-console');
