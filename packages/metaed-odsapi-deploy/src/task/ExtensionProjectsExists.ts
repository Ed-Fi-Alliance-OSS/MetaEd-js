import { MetaEdConfiguration, versionSatisfies, V3OrGreater } from 'metaed-core';
import fs from 'fs-extra';
import path from 'path';
import Sugar from 'sugar';
import winston from 'winston';

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

      winston.error(`Expected ${projectName} project but was not at path: ${resolvedPath}`);
      result = false;
    });
  });

  return result;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V3OrGreater)) {
    return true;
  }

  return extensionProjectsExists(metaEdConfiguration);
}
