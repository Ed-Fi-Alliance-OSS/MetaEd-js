// @flow
import path from 'path';
import { Logger, transports } from 'winston';
import * as Chalk from 'chalk';
import { build } from '../../metaed-core/src/task/Pipeline';
import { newState } from '../../metaed-core/src/State';
import type { State } from '../../metaed-core/src/State';

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

const chalk = new Chalk.constructor({ level: 2 });

const logger = new Logger({
  level: 'info',
  transports: [
    new transports.Console(),
  ],
});
logger.cli();

logger.info(`Executing MetaEd Console on core ${path.resolve(__dirname, argv.edfi)} and extension ${argv.ext}.`);
logger.info('');

const state: State = Object.assign(newState(), {
  inputDirectories: [
    {
      path: path.resolve(__dirname, argv.edfi),
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

const endState: State = build(state);

const errorMessages = endState.validationFailure;
if (errorMessages.size === 0) {
  logger.info('No errors found.');
} else {
  errorMessages.forEach(message => {
    const filename = message.fileMap ? path.relative(`${argv.edfi}\\..`, message.fileMap.filename) : '';
    const lineNumber = message.fileMap ? message.fileMap.lineNumber : '';
    const column = message.sourceMap ? message.sourceMap.column : '';
    logger.error(`${message.message} ${chalk.gray(`${filename} (${lineNumber},${column})`)}`);
  });
}

logger.info('');
logger.info('MetaEd Console execution completed.');
