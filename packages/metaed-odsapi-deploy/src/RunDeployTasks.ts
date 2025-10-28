// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger, MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { execute as deployCoreTask } from './task/DeployCore';
import { execute as deployExtensionTask } from './task/DeployExtension';
import { execute as extensionProjectsExistsTask } from './task/ExtensionProjectsExists';
import { execute as legacyDirectoryExistsTask } from './task/LegacyDirectoryExists';
import { execute as refreshProjectTask } from './task/RefreshProject';
import { execute as removeExtensionArtifactsTask } from './task/RemoveExtensionArtifacts';
import { DeployResult } from './task/DeployResult';
import { DeployTask } from './task/DeployTask';

/**
 * Runs the full set of deployment tasks in order, returning true if they are all successful.
 * If any task is unsuccessful, task execution stops and false is returned along with a failure message.
 *
 * @param metaEdConfiguration the MetaEdConfiguration for the deployment
 * @param deployCore whether the core data model should be deployed along with an extension
 * @param suppressDelete whether deletion of the existing ODS/API configuration should be suppressed
 * @param additionalMssqlScriptsDirectory Full path to optional folder for post deploy MSSQL database scripts. This folder will be copied to the corresponding Data directory.
 * @param additionalPostgresScriptsDirectory Full path to optional folder for post deploy PostgreSql database scripts This folder will be copied to the corresponding Data directory.
 * @returns deploy result with success indicating if the deploy was successful and a failureMessage if it was not
 */
export async function runDeployTasks(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  deployCore: boolean,
  suppressDelete: boolean,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  try {
    const tasks: DeployTask[] = [
      extensionProjectsExistsTask,

      removeExtensionArtifactsTask,

      deployCoreTask,

      deployExtensionTask,

      refreshProjectTask,

      legacyDirectoryExistsTask,
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const task of tasks) {
      const deployResult: DeployResult = await task(
        metaEdConfiguration,
        dataStandardVersion,
        deployCore,
        suppressDelete,
        additionalMssqlScriptsDirectory,
        additionalPostgresScriptsDirectory,
      );
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
