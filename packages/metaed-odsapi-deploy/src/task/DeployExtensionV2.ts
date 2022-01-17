import fs from 'fs-extra';
import { MetaEdConfiguration, V2Only } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import winston from 'winston';
import { CopyOptions } from '../CopyOptions';

const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: 'Ed-Fi-ODS-Implementation/Extensions/Metadata/' },
  { src: 'Database/SQLServer/ODS/Data/', dest: 'Ed-Fi-ODS-Implementation/Database/Data/EdFi/' },
  { src: 'Database/SQLServer/ODS/Structure/', dest: 'Ed-Fi-ODS-Implementation/Database/Structure/EdFi/' },
  { src: 'Interchange/', dest: 'Ed-Fi-ODS-Implementation/Extensions/Schemas/' },
  { src: 'XSD/', dest: 'Ed-Fi-ODS-Implementation/Extensions/Schemas/' },
];

function deployExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration): void {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs
    .readdirSync(artifactDirectory)
    .filter((x: string) => !['Documentation', 'EdFi'].includes(x));

  projectsNames.forEach((projectName: string) => {
    artifacts.forEach((artifact: CopyOptions) => {
      const resolvedArtifact: CopyOptions = {
        ...artifact,
        src: path.resolve(artifactDirectory, projectName, artifact.src),
        dest: path.resolve(deployDirectory, artifact.dest),
      };
      if (!fs.pathExistsSync(resolvedArtifact.src)) return;

      try {
        winston.info(`Deploy ${resolvedArtifact.src} to ${resolvedArtifact.dest}`);

        fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
      } catch (err) {
        winston.error(`Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`);
      }
    });
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V2Only)) {
    return true;
  }

  deployExtensionArtifacts(metaEdConfiguration);

  return true;
}
