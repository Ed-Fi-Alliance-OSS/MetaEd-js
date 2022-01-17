import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import { deriveNamespaceFromProjectName } from '@edfi/metaed-core';

const PROJECT_SETTINGS_FILE_NAME = 'package.json';

interface ProjectFileData {
  projectName: string;
  projectVersion: string;
  projectDescription: string;
}

async function projectValuesFromProjectJson(verifiedPathToProjectJson: string): Promise<ProjectFileData | null> {
  const projectJson = await fs.readJson(verifiedPathToProjectJson);
  if (projectJson.metaEdProject && projectJson.metaEdProject.projectName && projectJson.metaEdProject.projectVersion)
    return projectJson.metaEdProject;
  return null;
}

export interface MetaEdProjectMetadata {
  projectPath: string;
  invalidProject: boolean;
  invalidProjectReason: string;
  projectName: string;
  projectVersion: string;
  projectNamespace: string;
  isExtensionProject: boolean;
  projectExtension: string;
  projectDescription: string;
}

function newMetaEdProjectMetadata(projectPath: string): MetaEdProjectMetadata {
  return {
    projectPath,
    invalidProject: false,
    invalidProjectReason: '',
    projectName: '',
    projectVersion: '',
    projectNamespace: '',
    isExtensionProject: false,
    projectExtension: '',
    projectDescription: '',
  };
}

export function validProjectMetadata(metaEdProjectMetadata: MetaEdProjectMetadata[]): boolean {
  let hasInvalidProject = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const pm of metaEdProjectMetadata) {
    if (pm.invalidProject) {
      hasInvalidProject = true;
    }
  }
  if (hasInvalidProject) return false;

  return true;
}
export async function findMetaEdProjectMetadata(projectPaths: string[]): Promise<MetaEdProjectMetadata[]> {
  const result: MetaEdProjectMetadata[] = await Promise.all(
    projectPaths.map(async (projectPath: string) => {
      const projectJsonFilePath = path.join(projectPath, PROJECT_SETTINGS_FILE_NAME);
      // if (!(await fs.exists(projectJsonFilePath))) {
      //   if (createProjectJson) {
      //     await newProjectJson(projectPath);
      //   } else
      //     return {
      //       ...newMetaEdProjectMetadata(projectPath),
      //       invalidProject: true,
      //       invalidProjectReason: `does not exist at ${projectPath}`,
      //     };
      // }

      const projectFileData: ProjectFileData | null = await projectValuesFromProjectJson(projectJsonFilePath);
      if (projectFileData == null) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason: 'must have both metaEdProject.projectName and metaEdProject.projectVersion definitions',
        };
      }

      const projectNamespace: string | null = deriveNamespaceFromProjectName(projectFileData.projectName);
      if (projectNamespace == null) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason:
            'metaEdProject.projectName definition must begin with an uppercase character. All other characters must be alphanumeric only.',
        };
      }

      const projectVersion = projectFileData.projectVersion || '';
      if (!semver.valid(projectVersion)) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason:
            'metaEdProject.projectVersion is not a valid version declaration. Version declarations must follow the semver.org standard.',
        };
      }

      return {
        ...newMetaEdProjectMetadata(projectPath),
        projectName: projectFileData.projectName,
        projectVersion,
        projectNamespace,
        isExtensionProject: projectNamespace !== 'EdFi',
        projectExtension: projectNamespace === 'EdFi' ? '' : 'EXTENSION',
      };
    }),
  );
  return result;
}
