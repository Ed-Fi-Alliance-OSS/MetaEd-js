import { Logger, MetaEdConfiguration, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';

export function legacyCoreDirectoryExists(metaEdConfiguration: MetaEdConfiguration): void {
  const { deployDirectory } = metaEdConfiguration;
  const legacyDirectoryPaths: string[] = [`Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Standard/SupportingArtifacts`];

  legacyDirectoryPaths.forEach((legacyPath: string) => {
    const resolvedPath = path.resolve(deployDirectory, legacyPath);

    if (fs.pathExistsSync(resolvedPath)) {
      Logger.warn(
        `"SupportingArtifacts" directory found for Standard at ${resolvedPath}.  Please move any custom artifacts to the new "Artifact" directory and remove the "SupportingArtifacts" directory.`,
      );
    }
  });
}

export function legacyExtensionDirectoryExists(metaEdConfiguration: MetaEdConfiguration): void {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs
    .readdirSync(artifactDirectory)
    .filter((x: string) => !['Documentation', 'EdFi'].includes(x));

  projectsNames.forEach((projectName: string) => {
    const legacyDirectoryPaths: string[] = [
      `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectName}/SupportingArtifacts`,
    ];

    legacyDirectoryPaths.forEach((legacyPath: string) => {
      const resolvedPath = path.resolve(deployDirectory, legacyPath);

      if (fs.pathExistsSync(resolvedPath)) {
        Logger.warn(
          `"SupportingArtifacts" directory found for ${projectName} at ${resolvedPath}.  Please move any custom artifacts to the new "Artifact" directory and remove the "SupportingArtifacts" directory.`,
        );
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0')) {
    return true;
  }

  legacyCoreDirectoryExists(metaEdConfiguration);
  legacyExtensionDirectoryExists(metaEdConfiguration);
  return true;
}
