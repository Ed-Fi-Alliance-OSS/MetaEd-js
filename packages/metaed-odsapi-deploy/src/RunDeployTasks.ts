import winston from 'winston';
import { MetaEdConfiguration } from '@edfi/metaed-core';
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

/**
 * Runs the full set of deployment tasks in order, returning true if they are all successful.
 * If any task is unsuccessful, task execution stops and false is returned.
 *
 * @param metaEdConfiguration the MetaEdConfiguration for the deployment
 * @param deployCore whether the core data model should be deployed along with an extension
 * @param suppressDelete whether deletion of the existing ODS/API configuration should be suppressed
 * @returns true if the deploy was successful
 */
export async function runDeployTasks(
  metaEdConfiguration: MetaEdConfiguration,
  deployCore: boolean,
  suppressDelete: boolean,
): Promise<boolean> {
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

    // eslint-disable-next-line no-restricted-syntax
    for (const task of tasks) {
      const success = await task(metaEdConfiguration, deployCore, suppressDelete);
      if (!success) return false;
    }
  } catch (error) {
    winston.error(error);
    return false;
  }
  return true;
}
