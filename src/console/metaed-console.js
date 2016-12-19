// @flow
import winston from 'winston';
import { startingFromFileLoad } from '../core/tasks/Pipeline';
import { StateInstance } from '../core/State';
import type { State } from '../core/State';

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .alias('e', 'edfi')
  .nargs('e', 1)
  .describe('e', 'The base path where core MetaEd files will be loaded from. The directory must currently exist.')
  .alias('x', 'ext')
  .nargs('x', 1)
  .describe('x', 'The base path where extension MetaEd files will be loaded from. If provided, the directory must currently exist.')
  .demand(['e', 'x'])
  .help('h')
  .alias('h', 'help')
  .argv;

winston.level = 'info';

winston.info(`Executing MetaEd Console on core ${argv.edfi} and extension ${argv.ext}.`);
winston.info('');

// $FlowFixMe -- doesn't like constructor call on Immutable.Record
const state: State = new StateInstance({
  inputDirectories: [
    {
      path: argv.edfi,
      namespace: 'edfi',
      projectExtension: '',
      isExtension: false,
    },
    {
      path: argv.ext,
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    },
  ],
});

const endState: State = startingFromFileLoad(state);

const errorMessages = endState.get('errorMessages');
if (errorMessages.size === 0) {
  winston.info('No errors found.');
} else {
  errorMessages.forEach(
    message => winston.error(`${message.filename}(${message.lineNumber},${message.characterPosition}): ${message.message}`));
}

winston.info('');
winston.info('MetaEd Console execution completed.');
