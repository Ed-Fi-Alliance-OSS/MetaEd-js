// @flow
import fs from 'fs-extra';
import touch from 'touch';
import path from 'path';
import winston from 'winston';
import * as Chalk from 'chalk';
import R from 'ramda';
import { isDataStandard, versionSatisfies, V2Only, V3OrGreater } from 'metaed-core';
import type { MetaEdProject, SemVer, MetaEdConfiguration } from 'metaed-core';

winston.cli();
const chalk = new Chalk.constructor({ level: 3 });

type ArtifactPaths = {
  apiMetadata: string,
  databaseData: string,
  databaseStructure: string,
  interchange: string,
  xsd: string,
};

export type DeployTargets = {
  namespace: string,
  ...$Exact<ArtifactPaths>,
};

type OdsApiPaths = {
  root: string,
  implementation: string,
  application: string,
  extension: string,
  supportingArtifacts: string,
};

const odsApiPaths: OdsApiPaths = {
  root: 'Ed-Fi-ODS/',
  implementation: 'Ed-Fi-ODS-Implementation/',
  application: 'Application/',
  extension: 'EdFi.Ods.Standard.Extensions.',
  supportingArtifacts: 'SupportingArtifacts/',
};

// Artifact source directories
const sources = (): ArtifactPaths => ({
  apiMetadata: 'ApiMetadata/',
  databaseData: 'Database/SQLServer/ODS/Data/',
  databaseStructure: 'Database/SQLServer/ODS/Structure/',
  interchange: 'Interchange/',
  xsd: 'XSD/',
});

// >=3.0 target directories
const coreTarget = (namespace: string): DeployTargets => ({
  namespace,
  apiMetadata: path.join(odsApiPaths.root, 'Standard/Metadata/'),
  databaseData: path.join(odsApiPaths.root, 'Database/Data/EdFi/'),
  databaseStructure: path.join(odsApiPaths.root, 'Database/Structure/EdFi/'),
  interchange: path.join(odsApiPaths.root, 'Standard/Schemas/'),
  xsd: path.join(odsApiPaths.root, 'Standard/Schemas/'),
});

const extensionTarget = (namespace: string, projectName: string): DeployTargets => ({
  namespace,
  apiMetadata: path.join(
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
    'Metadata/',
  ),
  databaseData: path.join(
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
    'Database/Data/EdFi/',
  ),
  databaseStructure: path.join(
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
    'Database/Structure/EdFi/',
  ),
  interchange: path.join(
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
    'Schemas/',
  ),
  xsd: path.join(
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
    'Schemas/',
  ),
});

// 2.x target directories
const coreTargetV2 = (namespace: string): DeployTargets => ({
  namespace,
  apiMetadata: path.join(odsApiPaths.root, 'Standard/Metadata/'),
  databaseData: path.join(odsApiPaths.root, 'Database/Data/EdFi/'),
  databaseStructure: path.join(odsApiPaths.root, 'Database/Structure/EdFi/'),
  interchange: path.join(odsApiPaths.root, 'Standard/Schemas/'),
  xsd: path.join(odsApiPaths.root, 'Standard/Schemas/'),
});

const extensionTargetV2 = (namespace: string): DeployTargets => ({
  namespace,
  apiMetadata: path.join(odsApiPaths.implementation, 'Extensions/Metadata/'),
  databaseData: path.join(odsApiPaths.implementation, 'Database/Data/EdFi/'),
  databaseStructure: path.join(odsApiPaths.implementation, 'Database/Structure/EdFi/'),
  interchange: path.join(odsApiPaths.implementation, 'Extensions/Schemas/'),
  xsd: path.join(odsApiPaths.implementation, 'Extensions/Schemas/'),
});

export function getDeployTargetsFor(dataStandardVersion: SemVer, projects: Array<MetaEdProject>): Array<DeployTargets> {
  const targets: Array<DeployTargets> = [];

  if (versionSatisfies(dataStandardVersion, V3OrGreater)) {
    projects.forEach((project: MetaEdProject) => {
      if (isDataStandard(project)) {
        targets.push(coreTarget(project.namespace));
        // FIXME: MetaEdProject.projectName is not currently being read from package.json
      } else if (project.namespace === 'gb') {
        targets.push(extensionTarget(project.namespace, 'GrandBend'));
      } else {
        // TODO: update with projectName
        targets.push(extensionTarget(project.namespace, project.namespace));
      }
    });
  }

  if (versionSatisfies(dataStandardVersion, V2Only)) {
    projects.forEach((project: MetaEdProject) => {
      if (isDataStandard(project)) {
        targets.push(coreTargetV2(project.namespace));
      } else {
        targets.push(extensionTargetV2(project.namespace));
      }
    });
  }

  // core first, then extensions in alphabetical order
  return R.sortWith([R.descend(isDataStandard), R.ascend(R.prop('namespace'))])(targets);
}

function removeSupportingArtifacts(deployDirectory: string, projectName: string): void {
  if (deployDirectory === '') return;
  const target: string = path.resolve(
    deployDirectory,
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.supportingArtifacts,
  );
  try {
    if (!fs.existsSync(target)) return;

    fs.removeSync(target);
    winston.info(`deploy :: ${chalk.gray('Removed directory')} ${chalk.red('x')} ${target.replace(/\\/g, '/')}`);
  } catch (err) {
    winston.error(`deploy :: Attempted removal of ${chalk.red(target)} failed due to issue: ${err.message}`);
  }
}

function touchCSProjFile(deployDirectory: string, projectName: string): void {
  if (deployDirectory === '' || projectName === 'edfi') return;

  const csproj: string = '.csproj';
  const target: string = path.resolve(
    deployDirectory,
    odsApiPaths.implementation,
    odsApiPaths.application,
    odsApiPaths.extension + projectName,
    odsApiPaths.extension + projectName + csproj,
  );
  try {
    if (!fs.existsSync(target)) return;

    touch.sync(target, { nocreate: true });
    winston.info(`deploy :: ${chalk.gray('Touched project file')} ${chalk.green('*')} ${target.replace(/\\/g, '/')}`);
  } catch (err) {
    winston.error(`deploy :: Attempted modification of ${chalk.red(target)} failed due to issue: ${err.message}`);
  }
}

export async function executeDeploy(
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: SemVer,
  shouldDeployCore: boolean,
): Promise<Array<{ artifactSource: string, deployTarget: string }>> {
  let projects: Array<MetaEdProject> = metaEdConfiguration.projects;
  if (!shouldDeployCore) {
    projects = projects.filter(project => !isDataStandard(project));
  }
  const targets: Array<DeployTargets> = getDeployTargetsFor(dataStandardVersion, projects);

  if (targets.length === 0) return [];

  const tasks: Array<Promise<*>> = [];
  const source: ArtifactPaths = sources();
  const artifactDirectory: string = metaEdConfiguration.artifactDirectory;
  const deployDirectory: string = metaEdConfiguration.deployDirectory;

  targets.forEach((target: DeployTargets) => {
    removeSupportingArtifacts(deployDirectory, target.namespace);

    Object.keys(source).forEach((artifactName: string) => {
      const artifactSource: string = path.resolve(artifactDirectory, target.namespace, source[artifactName]);
      const deployTarget: string = path.resolve(deployDirectory, target[artifactName]);

      if (artifactSource == null && artifactSource === '') return;
      if (deployTarget == null && deployTarget === '') return;
      if (!fs.existsSync(artifactSource)) return;

      try {
        fs.readdirSync(artifactSource).forEach(file => {
          tasks.push(
            fs
              .copy(path.join(artifactSource, file), path.join(deployTarget, file))
              .then(() => ({ artifactSource, deployTarget })),
          );
        });
      } catch (err) {
        winston.error(`deploy :: Attempted deploy of ${artifactSource} failed due to issue: ${err.message}`);
      }
    });
  });

  let results: Array<{ artifactSource: string, deployTarget: string }> = [];

  try {
    results = await Promise.all(tasks);
    R.uniq(results).forEach((result: { artifactSource: string, deployTarget: string }) => {
      winston.info(
        `deploy :: ${chalk.gray('%s')} ${chalk.green('->')} %s`,
        path.relative(artifactDirectory, result.artifactSource).replace(/\\/g, '/'),
        result.deployTarget.replace(/\\/g, '/'),
      );
    });
    targets.forEach(target => touchCSProjFile(deployDirectory, target.namespace));
  } catch (err) {
    winston.error(`deploy :: Attempted deploy failed due to issue: ${err.message}`);
  }

  return results;
}
