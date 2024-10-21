import fs from 'fs-extra';
import {
  MetaEdConfiguration,
  MetaEdProject,
  SemVer,
  V7OrGreater,
  formatVersionWithSuppressPrereleaseVersion,
  isDataStandard,
} from '@edfi/metaed-core';
import { Logger, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import { CopyOptions } from '../CopyOptions';
import { DeployResult } from './DeployResult';

function deployPaths(extensionPath: string): CopyOptions[] {
  return [
    { src: 'ApiMetadata/', dest: `${extensionPath}/Metadata/` },
    { src: 'Database/SQLServer/ODS/Data/', dest: `${extensionPath}/MsSql/Data/Ods` },
    { src: 'Database/SQLServer/ODS/Structure/', dest: `${extensionPath}/MsSql/Structure/Ods` },
    { src: 'Database/PostgreSQL/ODS/Data/', dest: `${extensionPath}/PgSql/Data/Ods` },
    { src: 'Database/PostgreSQL/ODS/Structure/', dest: `${extensionPath}/PgSql/Structure/Ods` },
    { src: 'Interchange/', dest: `${extensionPath}/Schemas/` },
    { src: 'XSD/', dest: `${extensionPath}/Schemas/` },
  ];
}

function deployExtensionArtifacts(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _additionalMssqlScriptsDirectory?: string,
  _additionalPostgresScriptsDirectory?: string,
): DeployResult {
  const { artifactDirectory, deployDirectory, projects } = metaEdConfiguration;
  const projectsToDeploy: MetaEdProject[] = projects.filter((p: MetaEdProject) => !isDataStandard(p));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsToDeploy.every((projectToDeploy: MetaEdProject) => {
    const versionSatisfiesV7OrGreater = versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V7OrGreater);
    const dataStandardVersionFormatted = versionSatisfiesV7OrGreater
      ? formatVersionWithSuppressPrereleaseVersion(dataStandardVersion, metaEdConfiguration.suppressPrereleaseVersion)
      : dataStandardVersion;
    const extensionPath: string = `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectToDeploy.projectName}/Versions/${projectToDeploy.projectVersion}/Standard/${dataStandardVersionFormatted}/Artifacts`;

    deployPaths(extensionPath).every((deployPath: CopyOptions) => {
      const resolvedArtifact: CopyOptions = {
        ...deployPath,
        src: path.resolve(artifactDirectory, projectToDeploy.projectName, deployPath.src),
        dest: path.resolve(deployDirectory, deployPath.dest),
      };
      if (!fs.pathExistsSync(resolvedArtifact.src)) return true;

      try {
        Logger.info(`Deploy ${resolvedArtifact.src} to ${resolvedArtifact.dest}`);

        fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
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

    if (_additionalMssqlScriptsDirectory) {
      try {
        Logger.info(
          `Deploy ${_additionalMssqlScriptsDirectory} to ${path.resolve(
            deployDirectory,
            `${extensionPath}/MsSql/Data/Ods`,
          )}`,
        );
        fs.copySync(_additionalMssqlScriptsDirectory, path.resolve(deployDirectory, `${extensionPath}/MsSql/Data/Ods`));
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${_additionalMssqlScriptsDirectory} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
      }
    }

    if (_additionalPostgresScriptsDirectory) {
      try {
        Logger.info(
          `Deploy ${_additionalPostgresScriptsDirectory} to ${path.resolve(
            deployDirectory,
            `${extensionPath}/PgSql/Data/Ods`,
          )}`,
        );
        fs.copySync(_additionalPostgresScriptsDirectory, path.resolve(deployDirectory, `${extensionPath}/PgSql/Data/Ods`));
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${_additionalPostgresScriptsDirectory} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
      }
    }

    return true;
  });

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
  _additionalMssqlScriptsDirectory?: string,
  _additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=7.0.0')) {
    return { success: true };
  }

  return deployExtensionArtifacts(metaEdConfiguration, dataStandardVersion);
}
