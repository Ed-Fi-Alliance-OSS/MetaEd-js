// @flow
import winston from 'winston';
import { startingFromFileLoad } from '../core/task/Pipeline';
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

const state: State = {
  validationFailure: [],
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
  filepathsToExclude: new Set(),
  loadedFileSet: [],
  fileIndex: null,
  parseTree: null,
  repository: null,
  propertyIndex: null,
  pluginManifest: [],
};

const endState: State = startingFromFileLoad(state);

const errorMessages = endState.validationFailure;
if (errorMessages.size === 0) {
  winston.info('No errors found.');
} else {
  errorMessages.forEach(message => {
    const filename = message.fileMap ? message.fileMap.filename : '';
    const lineNumber = message.fileMap ? message.fileMap.lineNumber : '';
    const column = message.sourceMap ? message.sourceMap.column : '';
    winston.error(`${filename}(${lineNumber},${column}): ${message.message}`);
  });
}

winston.info('');
winston.info('MetaEd Console execution completed.');
