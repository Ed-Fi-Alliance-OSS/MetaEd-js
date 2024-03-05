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

function deployExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration, dataStandardVersion: SemVer): DeployResult {
  const { artifactDirectory, deployDirectory, projects } = metaEdConfiguration;
  const projectsToDeploy: MetaEdProject[] = projects.filter((p: MetaEdProject) => !isDataStandard(p));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsToDeploy.forEach((projectToDeploy: MetaEdProject) => {
    const versionSatisfiesV7OrGreater = versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V7OrGreater);
    const dataStandardVersionFormatted = versionSatisfiesV7OrGreater
      ? formatVersionWithSuppressPrereleaseVersion(dataStandardVersion, metaEdConfiguration.suppressPrereleaseVersion)
      : dataStandardVersion;
    const extensionPath: string = `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectToDeploy.projectName}/Versions/${projectToDeploy.projectVersion}/Standard/${dataStandardVersionFormatted}/Artifacts`;

    deployPaths(extensionPath).forEach((deployPath: CopyOptions) => {
      const resolvedArtifact: CopyOptions = {
        ...deployPath,
        src: path.resolve(artifactDirectory, projectToDeploy.projectName, deployPath.src),
        dest: path.resolve(deployDirectory, deployPath.dest),
      };
      if (!fs.pathExistsSync(resolvedArtifact.src)) return;

      try {
        Logger.info(`Deploy ${resolvedArtifact.src} to ${resolvedArtifact.dest}`);

        fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted deploy of ${deployPath.src} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
      }
    });
  });

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<DeployResult> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=7.0.0')) {
    return { success: true };
  }

  return deployExtensionArtifacts(metaEdConfiguration, dataStandardVersion);
}
