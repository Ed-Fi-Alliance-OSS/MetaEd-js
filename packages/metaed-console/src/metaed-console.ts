/* eslint-disable dot-notation */
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import winston from 'winston';
import Yargs from 'yargs';
import {
  executePipeline,
  newState,
  newMetaEdConfiguration,
  MetaEdConfiguration,
  findDataStandardVersions,
} from '@edfi/metaed-core';
import type { State, SemVer } from '@edfi/metaed-core';
import { defaultPlugins } from '@edfi/metaed-default-plugins';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

export async function metaEdConsole() {
  const { argv } = Yargs.usage('Usage: $0 [options]')
    .config('config', (configPath) => JSON.parse(fs.readFileSync(path.resolve(__dirname, configPath), 'utf-8')))
    .option('config', {
      alias: 'c',
    })
    .option('defaultPluginTechVersion', {
      alias: 'x',
      describe: 'The default technology version for all plugins, in semver format',
      type: 'string',
    })
    .option('accept-license', {
      alias: 'a',
      describe: 'Accept the Ed-Fi License Agreement at https://www.ed-fi.org/getting-started/license-ed-fi-technology',
      type: 'string',
      demandOption: true,
    })
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'v');

  const startTime = Date.now();

  const state: State = {
    ...newState(),
    metaEdConfiguration: Object.assign(newMetaEdConfiguration(), {
      ...(argv['metaEdConfiguration'] as MetaEdConfiguration),
    }),
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
      stopOnValidationFailure: true,
    },
    metaEdPlugins: defaultPlugins(),
  };

  if (argv['defaultPluginTechVersion'] != null)
    state.metaEdConfiguration.defaultPluginTechVersion = argv['defaultPluginTechVersion'];

  const dataStandardVersions: SemVer[] = findDataStandardVersions(state.metaEdConfiguration.projects);

  if (dataStandardVersions.length === 0) {
    winston.error('No data standard project found.  Aborting.');
    process.exitCode = 1;
  } else if (dataStandardVersions.length > 1) {
    winston.error('Multiple data standard projects found.  Aborting.');
    process.exitCode = 1;
  } else {
    // eslint-disable-next-line prefer-destructuring
    state.metaEd.dataStandardVersion = dataStandardVersions[0];
    try {
      const { failure } = await executePipeline(state);
      process.exitCode = !state.validationFailure.some((vf) => vf.category === 'error') && !failure ? 0 : 1;
    } catch (e) {
      winston.error(e);
      process.exitCode = 1;
    }
  }
  const endTime = Date.now() - startTime;
  winston.info(`Done in ${chalk.green(endTime > 1000 ? `${endTime / 1000}s` : `${endTime}ms`)}.`);
}
