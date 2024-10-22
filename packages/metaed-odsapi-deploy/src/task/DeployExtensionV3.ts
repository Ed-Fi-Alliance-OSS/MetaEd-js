import fs from 'fs-extra';
import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import Sugar from 'sugar';
import { CopyOptions } from '../CopyOptions';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const extensionPath: string = 'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/SupportingArtifacts';
const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: `${extensionPath}/Metadata/` },
  { src: 'Database/SQLServer/ODS/Data/', dest: `${extensionPath}/Database/Data/EdFi` },
  { src: 'Database/SQLServer/ODS/Structure/', dest: `${extensionPath}/Database/Structure/EdFi` },
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

  projectsNames.every((projectName: string) =>
    artifacts.every((artifact: CopyOptions) => {
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
    }),
  );

  if (additionalMssqlScriptsDirectory) {
    try {
      Logger.info(
        `Deploy ${additionalMssqlScriptsDirectory} to ${path.resolve(deployDirectory, `${extensionPath}/MsSql/Data/Ods`)}`,
      );
      fs.copySync(additionalMssqlScriptsDirectory, path.resolve(deployDirectory, `${extensionPath}/MsSql/Data/Ods`));
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
      Logger.info(
        `Deploy ${additionalPostgresScriptsDirectory} to ${path.resolve(
          deployDirectory,
          `${extensionPath}/PgSql/Data/Ods`,
        )}`,
      );
      fs.copySync(additionalPostgresScriptsDirectory, path.resolve(deployDirectory, `${extensionPath}/PgSql/Data/Ods`));
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
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
  additionalMssqlScriptsDirectory?: string,
  additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '<5.3.0')) {
    return { success: true };
  }

  return deployExtensionArtifacts(metaEdConfiguration, additionalMssqlScriptsDirectory, additionalPostgresScriptsDirectory);
}
