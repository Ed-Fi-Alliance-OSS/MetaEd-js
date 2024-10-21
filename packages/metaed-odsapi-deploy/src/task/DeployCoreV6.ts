import type { MetaEdConfiguration, SemVer } from '@edfi/metaed-core';
import { versionSatisfies, Logger } from '@edfi/metaed-core';
import fs from 'fs-extra';
import path from 'path';
import { CopyOptions } from '../CopyOptions';
import { DeployResult } from './DeployResult';

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

function deployCoreArtifacts(
  metaEdConfiguration: MetaEdConfiguration,
  _additionalMssqlScriptsDirectory?: string,
  _additionalPostgresScriptsDirectory?: string,
): DeployResult {
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

  if (_additionalMssqlScriptsDirectory) {
    try {
      fs.copySync(_additionalMssqlScriptsDirectory, path.resolve(deployDirectory, '/MsSql/Data/Ods'));
    } catch (err) {
      deployResult = {
        success: false,
        failureMessage: `Attempted deploy of ${_additionalMssqlScriptsDirectory} failed due to issue: ${err.message}`,
      };
      Logger.error(deployResult.failureMessage);
    }
  }

  if (_additionalPostgresScriptsDirectory) {
    try {
      fs.copySync(_additionalPostgresScriptsDirectory, path.resolve(deployDirectory, '/PgSql/Data/Ods'));
    } catch (err) {
      deployResult = {
        success: false,
        failureMessage: `Attempted deploy of ${_additionalPostgresScriptsDirectory} failed due to issue: ${err.message}`,
      };
      Logger.error(deployResult.failureMessage);
    }
  }

  return deployResult;
}

export async function execute(
  metaEdConfiguration: MetaEdConfiguration,
  _dataStandardVersion: SemVer,
  deployCore: boolean,
  _suppressDelete: boolean,
  _additionalMssqlScriptsDirectory?: string,
  _additionalPostgresScriptsDirectory?: string,
): Promise<DeployResult> {
  if (!deployCore) return { success: true };
  if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=3.3.0 <7.0.0')) {
    return { success: true };
  }

  return deployCoreArtifacts(metaEdConfiguration);
}
