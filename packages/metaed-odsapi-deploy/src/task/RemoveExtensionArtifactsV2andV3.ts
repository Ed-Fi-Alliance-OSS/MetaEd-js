import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

export function removeExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsNames.every((projectName: string) => {
    const removeablePaths: string[] = [
      `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectName}/SupportingArtifacts`,
    ];

    return removeablePaths.every((removeablePath: string) => {
      const resolvedPath = path.resolve(deployDirectory, removeablePath);
      if (!fs.pathExistsSync(resolvedPath)) return true;

      try {
        Logger.info(`Remove ${projectName} artifacts ${resolvedPath}`);

        fs.removeSync(resolvedPath);
        return true;
      } catch (err) {
        deployResult = {
          success: false,
          failureMessage: `Attempted removal of ${resolvedPath} failed due to issue: ${err.message}`,
        };
        Logger.error(deployResult.failureMessage);
        return false;
      }
    });
  });

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  suppressDelete: boolean,
): Promise<DeployResult> {
  if (suppressDelete) return { success: true };
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=2.0.0 <3.3.0')) {
    return { success: true };
  }

  return removeExtensionArtifacts(metaEdConfiguration);
}
