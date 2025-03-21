// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

export function legacyCoreDirectoryExists(metaEdConfiguration: MetaEdConfiguration): void {
  const { deployDirectory } = metaEdConfiguration;
  const legacyDirectoryPaths: string[] = [`Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Standard/SupportingArtifacts`];

  legacyDirectoryPaths.forEach((legacyPath: string) => {
    const resolvedPath = path.resolve(deployDirectory, legacyPath);

    if (fs.pathExistsSync(resolvedPath)) {
      Logger.warn(
        `"SupportingArtifacts" directory found for Standard at ${resolvedPath}.  Please move any custom artifacts to the new "Artifact" directory and remove the "SupportingArtifacts" directory.`,
      );
    }
  });
}

export function legacyExtensionDirectoryExists(metaEdConfiguration: MetaEdConfiguration): void {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));

  projectsNames.forEach((projectName: string) => {
    const legacyDirectoryPaths: string[] = [
      `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectName}/SupportingArtifacts`,
    ];

    legacyDirectoryPaths.forEach((legacyPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, legacyPath);

      if (fs.pathExistsSync(resolvedPath)) {
        Logger.warn(
          `"SupportingArtifacts" directory found for ${projectName} at ${resolvedPath}.  Please move any custom artifacts to the new "Artifact" directory and remove the "SupportingArtifacts" directory.`,
        );
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<DeployResult> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0')) {
    return { success: true };
  }

  legacyCoreDirectoryExists(metaEdConfiguration);
  legacyExtensionDirectoryExists(metaEdConfiguration);
  return { success: true };
}
