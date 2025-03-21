// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger, MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import chalk from 'chalk';
import fs from 'fs-extra';
import touch from 'touch';
import path from 'path';
import Sugar from 'sugar';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const projectPaths: string[] = [
  'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/EdFi.Ods.Extensions.{projectName}.csproj',
];

export function refreshProject(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsNames.every((projectName: string) =>
    projectPaths.every((projectPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, Sugar.String.format(projectPath, { projectName }));
      if (!fs.pathExistsSync(resolvedPath)) return true;

      try {
        Logger.info(`Refresh ${resolvedPath}`);

        touch.sync(resolvedPath, { nocreate: true });
        return true;
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted modification of ${chalk.red(resolvedPath)} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
        return false;
      }
    }),
  );

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<DeployResult> {
  return refreshProject(metaEdConfiguration);
}
