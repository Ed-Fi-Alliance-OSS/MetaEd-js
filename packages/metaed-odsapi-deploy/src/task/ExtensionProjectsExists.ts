import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import Sugar from 'sugar';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const projectPaths: string[] = ['Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/'];

export function extensionProjectsExists(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));
  let deployResult: DeployResult = {
    success: true,
  };

  projectsNames.every((projectName: string) =>
    projectPaths.every((projectPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, Sugar.String.format(projectPath, { projectName }));
      if (fs.pathExistsSync(resolvedPath)) return true;
      deployResult = {
        success: false,
        failureMessage: `Expected ${projectName} project but was not at path: ${resolvedPath}`,
      };
      Logger.error(deployResult.failureMessage);
      return false;
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
  // extension projects in the ODS/API only exist starting in 3.0.0
  if (versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '<3.0.0')) {
    return { success: true };
  }

  return extensionProjectsExists(metaEdConfiguration);
}
