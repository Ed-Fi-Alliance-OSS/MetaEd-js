import { MetaEdConfiguration, V2Only, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import { CopyOptions } from '../CopyOptions';

const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: 'Ed-Fi-ODS/Standard/Metadata/' },
  { src: 'Database/SQLServer/ODS/Data/', dest: 'Ed-Fi-ODS/Database/Data/EdFi' },
  { src: 'Database/SQLServer/ODS/Structure/', dest: 'Ed-Fi-ODS/Database/Structure/EdFi' },
  { src: 'Interchange/', dest: 'Ed-Fi-ODS/Standard/Schemas/' },
  { src: 'XSD/', dest: 'Ed-Fi-ODS/Standard/Schemas/' },
];

function deployCoreArtifacts(metaEdConfiguration: MetaEdConfiguration) {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectName: string = 'EdFi';

  artifacts.forEach((artifact: CopyOptions) => {
    const resolvedArtifact: CopyOptions = {
      ...artifact,
      src: path.resolve(artifactDirectory, projectName, artifact.src),
      dest: path.resolve(deployDirectory, artifact.dest),
    };
    if (!fs.pathExistsSync(resolvedArtifact.src)) return;

    try {
      const relativeArtifactSource = path.relative(artifactDirectory, resolvedArtifact.src);
      winston.info(`Deploy ${relativeArtifactSource} to ${artifact.dest}`);

      fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
    } catch (err) {
      winston.error(`Attempted deploy of ${resolvedArtifact.src} failed due to issue: ${err.message}`);
    }
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!deployCore) return true;
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, V2Only)) {
    return true;
  }

  deployCoreArtifacts(metaEdConfiguration);

  return true;
}
