import fs from 'fs-extra';
import type { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { Logger, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import Sugar from 'sugar';
import { CopyOptions } from '../CopyOptions';
import { directoryExcludeList } from './DeployConstants';

const extensionPath: string = 'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts';
const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: `${extensionPath}/Metadata/` },
  { src: 'Database/SQLServer/ODS/Data/', dest: `${extensionPath}/MsSql/Data/Ods` },
  { src: 'Database/SQLServer/ODS/Structure/', dest: `${extensionPath}/MsSql/Structure/Ods` },
  { src: 'Database/PostgreSQL/ODS/Data/', dest: `${extensionPath}/PgSql/Data/Ods` },
  { src: 'Database/PostgreSQL/ODS/Structure/', dest: `${extensionPath}/PgSql/Structure/Ods` },
  { src: 'Interchange/', dest: `${extensionPath}/Schemas/` },
  { src: 'XSD/', dest: `${extensionPath}/Schemas/` },
];

function deployExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration): void {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));

  projectsNames.forEach((projectName: string) => {
    artifacts.forEach((artifact: CopyOptions) => {
      const dest = Sugar.String.format(artifact.dest, { projectName });
      const resolvedArtifact: CopyOptions = {
        ...artifact,
        src: path.resolve(artifactDirectory, projectName, artifact.src),
        dest: path.resolve(deployDirectory, dest),
      };
      if (!fs.pathExistsSync(resolvedArtifact.src)) return;

      try {
        Logger.info(`Deploy ${resolvedArtifact.src} to ${resolvedArtifact.dest}`);

        fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
      } catch (err) {
        Logger.error(`Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`);
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0 <7.0.0')) {
    return true;
  }

  deployExtensionArtifacts(metaEdConfiguration);

  return true;
}
