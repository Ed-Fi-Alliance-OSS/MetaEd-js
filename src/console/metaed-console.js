// @flow
import commander from 'commander';
import winston from 'winston';
import start from '../core/tasks/Pipeline';
import { StateInstance } from '../core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../core/State';

commander.version('0.8')
.option('--edfi <coreDir>', 'The base path where core MetaEd files will be loaded from. The directory must currently exist.')
.option('--ext <extensionDir>', 'The base path where extension MetaEd files will be loaded from. If provided, the directory must currently exist.')
.parse(process.argv);

winston.level = 'info';

winston.info(`Executing MetaEd Console on core ${commander.edfi} and extension ${commander.ext}.`);
winston.info('');

// $FlowFixMe -- doesn't like constructor call on Immutable.Record
const state: State = new StateInstance({
  inputDirectories: [
    {
      path: commander.edfi,
      namespace: 'edfi',
      projectExtension: '',
      isExtension: false,
    },
    {
      path: commander.ext,
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    },
  ],
});

const endState: State = start(state);

const errorMessageCollection = endState.get('errorMessageCollection');
if (errorMessageCollection.size === 0) {
  winston.info('No errors found.');
} else {
  errorMessageCollection.forEach(
    message => winston.error(`${message.filename}(${message.lineNumber},${message.characterPosition}): ${message.message}`));
}

winston.info('');
winston.info('MetaEd Console execution completed.');
