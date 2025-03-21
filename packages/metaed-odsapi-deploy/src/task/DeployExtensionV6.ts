// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'fs-extra';
import type { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { Logger, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import Sugar from 'sugar';
import { CopyOptions } from '../CopyOptions';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const extensionPath: string = 'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts';
const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: `${extensionPath}/Metadata/` },
  { src: 'Database/SQLServer/ODS/Data/', dest: `${extensionPath}/MsSql/Data/Ods` },
  { src: 'Database/SQLServer/ODS/Structure/', dest: `${extensionPath}/MsSql/Structure/Ods` },
  { src: 'Database/PostgreSQL/ODS/Data/', dest: `${extensionPath}/PgSql/Data/Ods` },
  { src: 'Database/PostgreSQL/ODS/Structure/', dest: `${extensionPath}/PgSql/Structure/Ods` },
  { src: 'Interchange/', dest: `${extensionPath}/Schemas/` },
  { src: 'XSD/', dest: `${extensionPath}/Schemas/` },
];

function deployExtensionArtifacts(
  metaEdConfiguration: MetaEdConfiguration,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsNames.forEach((projectName: string) => {
    artifacts.forEach((artifact: CopyOptions) => {
      const dest = Sugar.String.format(artifact.dest, { projectName });
      const resolvedArtifact: CopyOptions = {
        ...artifact,
        src: path.resolve(artifactDirectory, projectName, artifact.src),
        dest: path.resolve(deployDirectory, dest),
      };
      if (!fs.pathExistsSync(resolvedArtifact.src)) return true;

      try {
        Logger.info(`Deploy ${resolvedArtifact.src} to ${resolvedArtifact.dest}`);

        fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
        return true;
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
        return false;
      }
    });

    if (additionalMssqlScriptsDirectory) {
      try {
        const extPath = Sugar.String.format(extensionPath, { projectName });
        const dataPath = path.resolve(deployDirectory, `${extPath}/MsSql/Data/Ods`);
        Logger.info(`Deploy ${additionalMssqlScriptsDirectory} to ${dataPath}`);

        fs.copySync(additionalMssqlScriptsDirectory, dataPath);
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${additionalMssqlScriptsDirectory} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
      }
    }

    if (additionalPostgresScriptsDirectory) {
      try {
        const extPath = Sugar.String.format(extensionPath, { projectName });
        const dataPath = path.resolve(deployDirectory, `${extPath}/PgSql/Data/Ods`);
        Logger.info(`Deploy ${additionalPostgresScriptsDirectory} to ${dataPath}`);

        fs.copySync(additionalPostgresScriptsDirectory, dataPath);
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${additionalPostgresScriptsDirectory} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
      }
    }
  });

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=5.4.0 <7.0.0')) {
    return { success: true };
  }

  return deployExtensionArtifacts(metaEdConfiguration, additionalMssqlScriptsDirectory, additionalPostgresScriptsDirectory);
}
