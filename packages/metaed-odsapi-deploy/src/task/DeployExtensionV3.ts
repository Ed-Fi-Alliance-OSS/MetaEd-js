import fs from 'fs-extra';
import { Logger, MetaEdConfiguration, SemVer, versionSatisfies } from '@edfi/metaed-core';
import path from 'path';
import Sugar from 'sugar';
import { CopyOptions } from '../CopyOptions';
import { directoryExcludeList } from './DeployConstants';
import { DeployResult } from './DeployResult';

const extensionPath: string = 'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/SupportingArtifacts';
const artifacts: CopyOptions[] = [
  { src: 'ApiMetadata/', dest: `${extensionPath}/Metadata/` },
  { src: 'Database/SQLServer/ODS/Data/', dest: `${extensionPath}/Database/Data/EdFi` },
  { src: 'Database/SQLServer/ODS/Structure/', dest: `${extensionPath}/Database/Structure/EdFi` },
  { src: 'Interchange/', dest: `${extensionPath}/Schemas/` },
  { src: 'XSD/', dest: `${extensionPath}/Schemas/` },
];

function deployExtensionArtifacts(metaEdConfiguration: MetaEdConfiguration): DeployResult {
  const { artifactDirectory, deployDirectory } = metaEdConfiguration;
  const projectsNames: string[] = fs.readdirSync(artifactDirectory).filter((x: string) => !directoryExcludeList.includes(x));

  const result: DeployResult = {
    success: true,
    failureMessage: undefined,
  };
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
        result.success = false;
        result.failureMessage = `Attempted deploy of ${artifact.src} failed due to issue: ${err.message}`;
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
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '<5.3.0')) {
    return { success: true };
  }

  return deployExtensionArtifacts(metaEdConfiguration);
}
