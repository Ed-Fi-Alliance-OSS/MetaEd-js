import type { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { defaultPluginTechVersion, Logger, versionSatisfies } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { CopyOptions } from '../CopyOptions';
import { DeployResult } from './DeployResult';

const excludeApiModel = (_src: string, dest: string): boolean => !dest.endsWith('ApiModel.json');

const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: 'Ed-Fi-ODS/Standard/Metadata/', options: { filter: excludeApiModel } },
  {
    src: 'ApiMetadata/ApiModel.json',
    dest: 'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Standard/SupportingArtifacts/Metadata/ApiModel.json',
  },
  { src: 'Database/SQLServer/ODS/Data/', dest: 'Ed-Fi-ODS/Database/Data/EdFi' },
  { src: 'Database/SQLServer/ODS/Structure/', dest: 'Ed-Fi-ODS/Database/Structure/EdFi' },
  { src: 'Interchange/', dest: 'Ed-Fi-ODS/Standard/Schemas/' },
  { src: 'XSD/', dest: 'Ed-Fi-ODS/Standard/Schemas/' },
];

function deployCoreArtifacts(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectName: string = 'EdFi';
  let deployResult: DeployResult = {
    success: true,
  };

  artifacts.every((artifact: CopyOptions) => {
    const resolvedArtifact: CopyOptions = {
      ...artifact,
      src: path.resolve(artifactDirectory, projectName, artifact.src),
      dest: path.resolve(deployDirectory, artifact.dest),
    };
    if (!fs.pathExistsSync(resolvedArtifact.src)) return true;

    try {
      const relativeArtifactSource = path.relative(artifactDirectory, resolvedArtifact.src);
      Logger.info(`Deploy ${relativeArtifactSource} to ${artifact.dest}`);

      fs.copySync(resolvedArtifact.src, resolvedArtifact.dest, resolvedArtifact.options);
      return true;
    } catch (err) {
      deployResult = {
        success: false,
        failureMessage: `Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`,
      };
      Logger.error(deployResult.failureMessage);
      return false;
    }
  });

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  deployCore: boolean,
  _suppressDelete: boolean,
): Promise<DeployResult> {
  if (!deployCore) return { success: true };
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, `>=${defaultPluginTechVersion} <5.3.0`)) {
    return { success: true };
  }

  return deployCoreArtifacts(metaEdConfiguration);
}
