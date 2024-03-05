/* eslint-disable dot-notation */
import chalk from 'chalk';
import path from 'path';
import Yargs from 'yargs';
import {
  Logger,
  scanForProjects,
  newMetaEdConfiguration,
  newState,
  executePipeline,
  newPipelineOptions,
  newMetaEdEnvironment,
  findDataStandardVersions,
} from '@edfi/metaed-core';
import type {
  SemVer,
  MetaEdConfiguration,
  State,
  PipelineOptions,
  MetaEdEnvironment,
  MetaEdProjectPathPairs,
  MetaEdProject,
} from '@edfi/metaed-core';
import { DeployResult, runDeployTasks } from '@edfi/metaed-odsapi-deploy';
import { defaultPlugins } from '@edfi/metaed-default-plugins';

export function dataStandardVersionFor(projects: MetaEdProject[]): SemVer {
  const dataStandardVersions: SemVer[] = findDataStandardVersions(projects);
  const errorMessage: string[] = [];

  if (dataStandardVersions.length === 0) {
    errorMessage.push('No data standard project found.  Aborting.');
  } else if (dataStandardVersions.length > 1) {
    errorMessage.push('Multiple data standard projects found.  Aborting.');
  } else {
    return dataStandardVersions[0];
  }
  if (errorMessage.length > 0) {
    errorMessage.forEach((err) => Logger.error(err));
    process.exit(1);
  }
  return '0.0.0';
}

export async function metaEdDeploy() {
  const startTime = Date.now();

  const yargs = Yargs.usage('Usage: $0 [options]')
    .group(['config'], 'Config file:')
    .config('config')
    .option('config', {
      alias: 'c',
    })
    .group(['source', 'target'], 'Command line:')
    .option('source' as any, {
      alias: 's',
      describe: 'The artifact source directories to scan',
      type: 'string',
      array: true,
      conflicts: 'config',
      // @ts-ignore
      requiresArg: 'target',
    })
    .option('target', {
      alias: 't',
      describe: 'The deploy target directory',
      type: 'string',
      conflicts: 'config',
      // @ts-ignore
      requiresArg: 'source',
    })
    .option('projectNames', {
      alias: 'p',
      describe: 'The artifact source projectNames to override',
      type: 'string',
      array: true,
      // @ts-ignore
      requiresArg: ['source', 'target'],
    })
    .option('defaultPluginTechVersion', {
      alias: 'x',
      describe: 'The default technology version for all plugins, in semver format',
      type: 'string',
    })
    .option('core', {
      describe: 'Deploy core in addition to any extensions',
      type: 'boolean',
      default: false,
    })
    .option('suppressDelete', {
      describe: 'Suppress deletion of the SupportingArtifacts deployment folder',
      type: 'boolean',
      default: false,
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

  let metaEdConfiguration: MetaEdConfiguration;
  if (yargs.argv['metaEdConfiguration'] == null) {
    // if this function was called outside the normal CLI flow, do nothing and return
    if (yargs.argv['source'] == null || yargs.argv['projectNames'] == null) return;

    const resolvedProjects: MetaEdProjectPathPairs[] = await scanForProjects(
      yargs.argv['source'],
      yargs.argv['projectNames'],
    );
    let suppressPrereleaseVersion: boolean;
    if (yargs.argv['suppressPrereleaseVersion'] != null) suppressPrereleaseVersion = yargs.argv['suppressPrereleaseVersion'];
    else suppressPrereleaseVersion = true;
    metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.join(resolvedProjects.slice(-1)[0].path, 'MetaEdOutput'),
      deployDirectory: yargs.argv['target'],
      projectPaths: resolvedProjects.map((projectPair: MetaEdProjectPathPairs) => projectPair.path),
      projects: resolvedProjects.map((projectPair: MetaEdProjectPathPairs) => projectPair.project),
      suppressPrereleaseVersion,
    };
    if (yargs.argv['defaultPluginTechVersion'] != null) {
      metaEdConfiguration.defaultPluginTechVersion = yargs.argv['defaultPluginTechVersion'];
    }
    const pipelineOptions: PipelineOptions = {
      ...newPipelineOptions(),
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
      stopOnValidationFailure: true,
    };
    const dataStandardVersion: SemVer = dataStandardVersionFor(metaEdConfiguration.projects);
    const metaEd: MetaEdEnvironment = {
      ...newMetaEdEnvironment(),
      dataStandardVersion,
      suppressPrereleaseVersion,
    };
    const state: State = { ...newState(), metaEdConfiguration, pipelineOptions, metaEd, metaEdPlugins: defaultPlugins() };
    try {
      const { failure } = await executePipeline(state);
      process.exitCode = !state.validationFailure.some((vf) => vf.category === 'error') && !failure ? 0 : 1;
    } catch (error) {
      Logger.error(error);
      process.exitCode = 1;
    }
  } else {
    metaEdConfiguration = { ...(yargs.argv['metaEdConfiguration'] as any) };
    if (yargs.argv['defaultPluginTechVersion'] != null) {
      metaEdConfiguration.defaultPluginTechVersion = yargs.argv['defaultPluginTechVersion'];
    }
  }

  // Run all deployment tasks
  const deploySuccess: DeployResult = await runDeployTasks(
    metaEdConfiguration,
    dataStandardVersionFor(metaEdConfiguration.projects),
    yargs.argv['core'],
    yargs.argv['suppressDelete'],
  );
  if (!deploySuccess.success) process.exitCode = 1;

  const endTime = Date.now() - startTime;
  Logger.info(`Done in ${chalk.green(endTime > 1000 ? `${endTime / 1000}s` : `${endTime}ms`)}.`);
}
