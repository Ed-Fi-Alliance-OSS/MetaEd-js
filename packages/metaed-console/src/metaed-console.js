// @flow

import path from 'path';
import { newState, newPipelineOptions, executePipeline } from 'metaed-core';
import type { State } from 'metaed-core';
import { Logger, transports } from 'winston';
import * as Chalk from 'chalk';
import Yargs from 'yargs';

export async function metaEdConsole() {
  const argv = Yargs
    .usage('Usage: $0 [options]')
    .alias('e', 'edfi')
    .nargs('e', 1)
    .describe('e', 'The base path where core MetaEd files will be loaded from. The directory must currently exist.')
    .alias('x', 'ext')
    .nargs('x', 1)
    .describe('x', 'The base path where extension MetaEd files will be loaded from. If provided, the directory must currently exist.')
    .demand(['e'])
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

  logger.info(`Executing MetaEd Console on core ${argv.edfi}${argv.ext ? ` and extension ${argv.ext}.` : ''}`);
  logger.info('');

  const state: State = Object.assign(newState(), {
    inputDirectories: [
      {
        path: argv.edfi,
        namespace: 'edfi',
        projectExtension: '',
        isExtension: false,
      },
    ],
    pipelineOptions: Object.assign(newPipelineOptions(), {
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
    }),
  });

  if (argv.ext && state.inputDirectories) {
    state.inputDirectories.push({
      path: argv.ext,
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    });
  }

  const endState: State = await executePipeline(state);

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
}
