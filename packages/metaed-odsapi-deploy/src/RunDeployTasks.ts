import { Logger, MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { execute as deployCoreTask } from './task/DeployCore';
import { execute as deployCoreV3Task } from './task/DeployCoreV3';
import { execute as deployCoreV6Task } from './task/DeployCoreV6';
import { execute as deployExtensionTask } from './task/DeployExtension';
import { execute as deployExtensionV3Task } from './task/DeployExtensionV3';
import { execute as deployExtensionV6Task } from './task/DeployExtensionV6';
import { execute as extensionProjectsExistsTask } from './task/ExtensionProjectsExists';
import { execute as legacyDirectoryExistsTask } from './task/LegacyDirectoryExists';
import { execute as refreshProjectTask } from './task/RefreshProject';
import { execute as removeExtensionArtifactsTask } from './task/RemoveExtensionArtifacts';
import { execute as removeExtensionArtifactsV2andV3Task } from './task/RemoveExtensionArtifactsV2andV3';
import { DeployResult } from './task/DeployResult';
import { DeployTask } from './task/DeployTask';

/**
 * Runs the full set of deployment tasks in order, returning true if they are all successful.
 * If any task is unsuccessful, task execution stops and false is returned along with a failure message.
 *
 * @param metaEdConfiguration the MetaEdConfiguration for the deployment
 * @param deployCore whether the core data model should be deployed along with an extension
 * @param suppressDelete whether deletion of the existing ODS/API configuration should be suppressed
 * @returns deploy result with success indicating if the deploy was successful and a failureMessage if it was not
 */
export async function runDeployTasks(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  deployCore: boolean,
  suppressDelete: boolean,
): Promise<DeployResult> {
  try {
    const tasks: DeployTask[] = [
      extensionProjectsExistsTask,

      removeExtensionArtifactsV2andV3Task,
      removeExtensionArtifactsTask,

      deployCoreV3Task,
      deployCoreV6Task,
      deployCoreTask,

      deployExtensionV3Task,
      deployExtensionV6Task,
      deployExtensionTask,

      refreshProjectTask,

      legacyDirectoryExistsTask,
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const task of tasks) {
      const deployResult: DeployResult = await task(metaEdConfiguration, dataStandardVersion, deployCore, suppressDelete);
      if (!deployResult.success) return deployResult;
    }
  } catch (error) {
    Logger.error(error);
    return {
      success: false,
      failureMessage: error,
    };
  }
  return {
    success: true,
  };
}
