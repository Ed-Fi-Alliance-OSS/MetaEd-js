import fs from 'fs-extra';
import { MetaEdConfiguration, MetaEdProject, SemVer, isDataStandard } from '@edfi/metaed-core';
import { Logger, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import { CopyOptions } from '../CopyOptions';

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

function deployExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration, dataStandardVersion: SemVer): void {
  const { artifactDirectory, deployDirectory, projects } = metaEdConfiguration;
  const projectsToDeploy: MetaEdProject[] = projects.filter((p: MetaEdProject) => !isDataStandard(p));

  projectsToDeploy.forEach((projectToDeploy: MetaEdProject) => {
    const extensionPath: string = `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.${projectToDeploy.projectName}/Versions/${projectToDeploy.projectVersion}/Standard/${dataStandardVersion}/Artifacts`;

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
        Logger.error(`Attempted deploy of ${deployPath.src} failed due to issue: ${err.message}`);
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=7.0.0')) {
    return true;
  }

  deployExtensionArtifacts(metaEdConfiguration, dataStandardVersion);

  return true;
}
