// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { execSync } from 'child_process';

try {
  execSync('npm install --loglevel error');
} catch (err) {
  console.error('Exception occurred during npm install atom-metaed:');
  console.error('--> stdout', err);
  console.error('--> sdterr', err.stderr.toString());
}

/* eslint-disable no-console */
console.info('Command arguments: ', process.argv);

// Implicitly calls the deploy process
// eslint-disable-next-line import/no-extraneous-dependencies
await import('@edfi/metaed-console');
