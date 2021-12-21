import chalk from 'chalk';
import path from 'path';
import winston from 'winston';
import Yargs from 'yargs';
import {
  scanForProjects,
  newMetaEdConfiguration,
  newState,
  executePipeline,
  newPipelineOptions,
  newMetaEdEnvironment,
  findDataStandardVersions,
} from 'metaed-core';
import {
  SemVer,
  MetaEdConfiguration,
  State,
  PipelineOptions,
  MetaEdEnvironment,
  MetaEdProjectPathPairs,
  MetaEdProject,
} from 'metaed-core';
import { execute as DeployCore } from './task/DeployCore';
import { execute as DeployCoreV2 } from './task/DeployCoreV2';
import { execute as DeployCoreV3 } from './task/DeployCoreV3';
import { execute as DeployExtension } from './task/DeployExtension';
import { execute as DeployExtensionV2 } from './task/DeployExtensionV2';
import { execute as DeployExtensionV3 } from './task/DeployExtensionV3';
import { execute as ExtensionProjectsExists } from './task/ExtensionProjectsExists';
import { execute as LegacyDirectoryExists } from './task/LegacyDirectoryExists';
import { execute as RefreshProject } from './task/RefreshProject';
import { execute as RemoveExtensionArtifacts } from './task/RemoveExtensionArtifacts';
import { execute as RemoveExtensionArtifactsV2andV3 } from './task/RemoveExtensionArtifactsV2andV3';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

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
    errorMessage.forEach(err => winston.error(err));
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
      requiresArg: 'source' as any,
    })
    .option('projectNames', {
      alias: 'p',
      describe: 'The artifact source projectNames to override',
      type: 'string',
      array: true,
      requiresArg: ['source', 'target'] as any,
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
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'v');

  let metaEdConfiguration: MetaEdConfiguration;

  const argv = yargs.argv as any;

  if (argv.metaEdConfiguration == null) {
    const resolvedProjects: MetaEdProjectPathPairs[] = await scanForProjects(argv.source, argv.projectNames);

    metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.join(resolvedProjects.slice(-1)[0].path, 'MetaEdOutput'),
      deployDirectory: argv.target,
      projectPaths: resolvedProjects.map((projectPair: MetaEdProjectPathPairs) => projectPair.path),
      projects: resolvedProjects.map((projectPair: MetaEdProjectPathPairs) => projectPair.project),
    };
    if (argv.defaultPluginTechVersion != null) {
      metaEdConfiguration.defaultPluginTechVersion = argv.defaultPluginTechVersion;
    }
    const pipelineOptions: PipelineOptions = {
      ...newPipelineOptions(),
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
      stopOnValidationFailure: true,
    };
    const dataStandardVersion: SemVer = dataStandardVersionFor(metaEdConfiguration.projects);
    const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };
    const state: State = { ...newState(), metaEdConfiguration, pipelineOptions, metaEd };

    try {
      const { failure } = await executePipeline(state);
      process.exitCode = !state.validationFailure.some(vf => vf.category === 'error') && !failure ? 0 : 1;
    } catch (error) {
      winston.error(error);
      process.exitCode = 1;
    }
  } else {
    metaEdConfiguration = { ...argv.metaEdConfiguration };
    if (argv.defaultPluginTechVersion != null) {
      metaEdConfiguration.defaultPluginTechVersion = argv.defaultPluginTechVersion;
    }
  }

  try {
    const tasks = [
      ExtensionProjectsExists,

      RemoveExtensionArtifactsV2andV3,
      RemoveExtensionArtifacts,

      DeployCoreV2,
      DeployCoreV3,
      DeployCore,

      DeployExtensionV2,
      DeployExtensionV3,
      DeployExtension,

      RefreshProject,

      LegacyDirectoryExists,
    ];

    let success = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const task of tasks) {
      success = await task(metaEdConfiguration, argv.core, argv.suppressDelete);

      if (!success) process.exitCode = 1;
    }
  } catch (error) {
    winston.error(error);
    process.exitCode = 1;
  }

  const endTime = Date.now() - startTime;
  winston.info(`Done in ${chalk.green(endTime > 1000 ? `${endTime / 1000}s` : `${endTime}ms`)}.`);
}
