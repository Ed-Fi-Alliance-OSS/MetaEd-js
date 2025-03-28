// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { versionSatisfies, Logger, formatVersionWithSuppressPrereleaseVersion, V7OrGreater } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { CopyOptions } from '../CopyOptions';
import { DeployResult } from './DeployResult';

function deployPaths(corePath: string): CopyOptions[] {
  return [
    { src: 'ApiMetadata/', dest: `${corePath}/Metadata/` },
    { src: 'Database/SQLServer/ODS/Data/', dest: `${corePath}/MsSql/Data/Ods` },
    { src: 'Database/SQLServer/ODS/Structure/', dest: `${corePath}/MsSql/Structure/Ods` },
    { src: 'Database/PostgreSQL/ODS/Data/', dest: `${corePath}/PgSql/Data/Ods` },
    { src: 'Database/PostgreSQL/ODS/Structure/', dest: `${corePath}/PgSql/Structure/Ods` },
    { src: 'Interchange/', dest: `${corePath}/Schemas/` },
    { src: 'XSD/', dest: `${corePath}/Schemas/` },
  ];
}

function deployCoreArtifacts(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectName: string = 'EdFi';
  const versionSatisfiesV7OrGreater = versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V7OrGreater);
  const dataStandardVersionFormatted = versionSatisfiesV7OrGreater
    ? formatVersionWithSuppressPrereleaseVersion(dataStandardVersion, metaEdConfiguration.suppressPrereleaseVersion)
    : dataStandardVersion;
  const corePath: string = `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/${dataStandardVersionFormatted}/Artifacts`;
  let deployResult: DeployResult = {
    success: true,
  };

  deployPaths(corePath).every((deployPath: CopyOptions) => {
    const resolvedDeployPath: CopyOptions = {
      ...deployPath,
      src: path.resolve(artifactDirectory, projectName, deployPath.src),
      dest: path.resolve(deployDirectory, deployPath.dest),
    };
    if (!fs.pathExistsSync(resolvedDeployPath.src)) return true;

    try {
      const relativeArtifactSource = path.relative(artifactDirectory, resolvedDeployPath.src);
      Logger.info(`Deploy ${relativeArtifactSource} to ${deployPath.dest}`);

      fs.copySync(resolvedDeployPath.src, resolvedDeployPath.dest, resolvedDeployPath.options);
      return true;
    } catch (err) {
      deployResult = {
        success: false,
        failureMessage: `Attempted deploy of ${deployPath.src} failed due to issue: ${err.message}`,
      };
      Logger.error(deployResult.failureMessage);
      return false;
    }
  });

  if (additionalMssqlScriptsDirectory) {
    try {
      const dataPath = path.resolve(deployDirectory, `${corePath}/MsSql/Data/Ods`);
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
      const dataPath = path.resolve(deployDirectory, `${corePath}/PgSql/Data/Ods`);
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

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  deployCore: boolean,
  _suppressDelete: boolean,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  if (!deployCore) return { success: true };
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=7.0.0')) {
    return { success: true };
  }

  return deployCoreArtifacts(
    metaEdConfiguration,
    dataStandardVersion,
    additionalMssqlScriptsDirectory,
    additionalPostgresScriptsDirectory,
  );
}
