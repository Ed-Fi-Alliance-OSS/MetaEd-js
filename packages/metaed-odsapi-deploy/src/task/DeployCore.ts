import type { MetaEdConfiguration } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import { CopyOptions } from '../CopyOptions';

const corePath: string = 'Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts';
const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: `${corePath}/Metadata/` },
  { src: 'Database/SQLServer/ODS/Data/', dest: `${corePath}/MsSql/Data/Ods` },
  { src: 'Database/SQLServer/ODS/Structure/', dest: `${corePath}/MsSql/Structure/Ods` },
  { src: 'Database/PostgreSQL/ODS/Data/', dest: `${corePath}/PgSql/Data/Ods` },
  { src: 'Database/PostgreSQL/ODS/Structure/', dest: `${corePath}/PgSql/Structure/Ods` },
  { src: 'Interchange/', dest: `${corePath}/Schemas/` },
  { src: 'XSD/', dest: `${corePath}/Schemas/` },
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
      winston.error(`Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`);
    }
  });
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  deployCore: boolean,
  _suppressDelete: boolean,
): Promise<boolean> {
  if (!deployCore) return true;
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0')) {
    return true;
  }

  deployCoreArtifacts(metaEdConfiguration);

  return true;
}
