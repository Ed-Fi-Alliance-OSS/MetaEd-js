import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import Sugar from 'sugar';

const projectPaths: string[] = ['Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/'];

export function extensionProjectsExists(metaEdConfiguration: MetaEdConfiguration): boolean {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs
    .readdirSync(artifactDirectory)
    .filter((x: string) => !['Documentation', 'EdFi'].includes(x));

  let result: boolean = true;

  projectsNames.forEach((projectName: string) => {
    projectPaths.forEach((projectPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, Sugar.String.format(projectPath, { projectName }));
      if (fs.pathExistsSync(resolvedPath)) return;

      Logger.error(`Expected ${projectName} project but was not at path: ${resolvedPath}`);
      result = false;
    });
  });

  return result;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  // extension projects in the ODS/API only exist starting in 3.0.0
  if (versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '<3.0.0')) {
    return true;
  }

  return extensionProjectsExists(metaEdConfiguration);
}
