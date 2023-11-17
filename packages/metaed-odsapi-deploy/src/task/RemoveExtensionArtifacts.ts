import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { directoryExcludeList } from './DeployConstants';

export function removeExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration): boolean {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));

  let result: boolean = true;

  projectsNames.forEach((projectName: string) => {
    const removeablePaths: string[] = [`Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectName}/Artifacts`];

    removeablePaths.forEach((removeablePath: string) => {
      const resolvedPath = path.resolve(deployDirectory, removeablePath);
      if (!fs.pathExistsSync(resolvedPath)) return;

      try {
        Logger.info(`Remove ${projectName} artifacts ${resolvedPath}`);

        fs.removeSync(resolvedPath);
      } catch (err) {
        Logger.error(`Attempted removal of ${resolvedPath} failed due to issue: ${err.message}`);
        result = false;
      }
    });
  });

  return result;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  suppressDelete: boolean,
): Promise<boolean> {
  if (suppressDelete) return true;
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0')) {
    return true;
  }

  return removeExtensionArtifacts(metaEdConfiguration);
}
