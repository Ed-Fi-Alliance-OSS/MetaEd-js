// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable dot-notation */
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import Yargs from 'yargs';
import {
  executePipeline,
  Logger,
  newState,
  newMetaEdConfiguration,
  MetaEdConfiguration,
  findDataStandardVersions,
} from '@edfi/metaed-core';
import type { State, SemVer } from '@edfi/metaed-core';
import { defaultPlugins } from '@edfi/metaed-default-plugins';

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
    .option('suppressPrereleaseVersion', {
      describe: 'Suppress the prerelease identifier in the version',
      type: 'boolean',
      default: true,
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
  if (argv['metaEdConfiguration'] == null) {
    if (argv['suppressPrereleaseVersion'] != null)
      state.metaEdConfiguration.suppressPrereleaseVersion = argv['suppressPrereleaseVersion'];
    else state.metaEdConfiguration.suppressPrereleaseVersion = true;
  }
  const dataStandardVersions: SemVer[] = findDataStandardVersions(state.metaEdConfiguration.projects);

  if (dataStandardVersions.length === 0) {
    Logger.error('No data standard project found.  Aborting.');
    process.exitCode = 1;
  } else if (dataStandardVersions.length > 1) {
    Logger.error('Multiple data standard projects found.  Aborting.');
    process.exitCode = 1;
  } else {
    // eslint-disable-next-line prefer-destructuring
    state.metaEd.dataStandardVersion = dataStandardVersions[0];
    try {
      const { failure } = await executePipeline(state);
      process.exitCode = !state.validationFailure.some((vf) => vf.category === 'error') && !failure ? 0 : 1;
    } catch (e) {
      Logger.error(e);
      process.exitCode = 1;
    }
  }
  const endTime = Date.now() - startTime;
  Logger.info(`Done in ${chalk.green(endTime > 1000 ? `${endTime / 1000}s` : `${endTime}ms`)}.`);
}
