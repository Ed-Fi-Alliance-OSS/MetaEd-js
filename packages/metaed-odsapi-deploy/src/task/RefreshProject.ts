import { Logger, MetaEdConfiguration } from '@edfi/metaed-core';
import chalk from 'chalk';
import fs from 'fs-extra';
import touch from 'touch';
import path from 'path';
import Sugar from 'sugar';

const projectPaths: string[] = [
  'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/EdFi.Ods.Extensions.{projectName}.csproj',
];

export function refreshProject(metaEdConfiguration: MetaEdConfiguration): void {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs
    .readdirSync(artifactDirectory)
    .filter((x: string) => !['Documentation', 'EdFi'].includes(x));

  projectsNames.forEach((projectName: string) => {
    projectPaths.forEach((projectPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, Sugar.String.format(projectPath, { projectName }));
      if (!fs.pathExistsSync(resolvedPath)) return;

      try {
        Logger.info(`Refresh ${resolvedPath}`);

        touch.sync(resolvedPath, { nocreate: true });
      } catch (err) {
        Logger.error(`Attempted modification of ${chalk.red(resolvedPath)} failed due to issue: ${err.message}`);
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  refreshProject(metaEdConfiguration);
  return true;
}
