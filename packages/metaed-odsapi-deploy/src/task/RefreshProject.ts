import { Logger, MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import chalk from 'chalk';
import fs from 'fs-extra';
import touch from 'touch';
import path from 'path';
import Sugar from 'sugar';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const projectPaths: string[] = [
  'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/EdFi.Ods.Extensions.{projectName}.csproj',
];

export function refreshProject(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));

  const result: DeployResult = {
    success: true,
    failureMessage: undefined,
  };
  projectsNames.forEach((projectName: string) => {
    projectPaths.forEach((projectPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, Sugar.String.format(projectPath, { projectName }));
      if (!fs.pathExistsSync(resolvedPath)) return;

      try {
        Logger.info(`Refresh ${resolvedPath}`);

        touch.sync(resolvedPath, { nocreate: true });
      } catch (err) {
        result.success = false;
        result.failureMessage = `Attempted modification of ${chalk.red(resolvedPath)} failed due to issue: ${err.message}`;
        Logger.error(result.failureMessage);
      }
    });
  });

  return result;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<DeployResult> {
  return refreshProject(metaEdConfiguration);
}
