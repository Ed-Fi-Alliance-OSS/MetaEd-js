/** @babel */
// @flow

import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import { packageJsonTemplate } from './ProjectTemplates';

const PROJECT_SETTINGS_FILE_NAME: string = 'package.json';

export async function newProjectJson(projectPath: string): Promise<void> {
  const configTemplate: string = packageJsonTemplate('Extension', '1.0.0');
  const newFilePath = path.join(projectPath, PROJECT_SETTINGS_FILE_NAME);
  await fs.writeFile(newFilePath, configTemplate);
  const notification = atom.notifications.addInfo(
    `A package.json project file with default name 'Extension' has been created for your project.`,
    {
      dismissable: true,
      buttons: [
        {
          text: 'View File',
          onDidClick: () => {
            atom.workspace.open(newFilePath);
            return notification.dismiss();
          },
        },
        {
          text: 'Close',
          onDidClick: () => notification.dismiss(),
        },
      ],
    },
  );
}

type ProjectFileData = {
  projectName: string,
  projectVersion: string,
};

async function projectValuesFromProjectJson(verifiedPathToProjectJson: string): Promise<?ProjectFileData> {
  const projectJson = await fs.readJson(verifiedPathToProjectJson);
  if (projectJson.metaEdProject && projectJson.metaEdProject.projectName && projectJson.metaEdProject.projectVersion)
    return projectJson.metaEdProject;
  return null;
}

function lowercaseAndNumericOnly(aString: string): ?string {
  const alphanumericMatches: ?Array<string> = aString.match(/[a-zA-Z0-9]+/g);
  if (alphanumericMatches == null) return null;
  const alphanumericOnly = alphanumericMatches.join('');
  const leadingAlphaCharacter = /^[a-zA-Z]/;
  if (!alphanumericOnly || !alphanumericOnly.match(leadingAlphaCharacter)) return null;
  return alphanumericOnly.toLowerCase();
}

export type MetaEdProjectMetadata = {
  projectPath: string,
  invalidProject: boolean,
  invalidProjectReason: string,
  projectName: string,
  projectVersion: string,
  projectNamespace: string,
  isExtensionProject: boolean,
  projectExtension: string,
};

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
  };
}

export async function findMetaEdProjectMetadata(createProjectJson: boolean = false): Promise<Array<MetaEdProjectMetadata>> {
  const result: Array<MetaEdProjectMetadata> = await Promise.all(
    atom.project.getPaths().map(async (projectPath: string) => {
      const projectJsonFilePath = path.join(projectPath, PROJECT_SETTINGS_FILE_NAME);
      if (!await fs.exists(projectJsonFilePath)) {
        if (createProjectJson) {
          await newProjectJson(projectPath);
        } else
          return {
            ...newMetaEdProjectMetadata(projectPath),
            invalidProject: true,
            invalidProjectReason: `does not exist at ${projectPath}`,
          };
      }

      const projectFileData: ?ProjectFileData = await projectValuesFromProjectJson(projectJsonFilePath);
      if (projectFileData == null) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason: 'must have both metaEdProject.projectName and metaEdProject.projectVersion definitions',
        };
      }

      const projectNamespace: ?string = lowercaseAndNumericOnly(projectFileData.projectName);
      if (projectNamespace == null) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason: 'metaEdProject.projectName definition has no leading alphabetic character',
        };
      }

      const projectVersion = semver.coerce(projectFileData.projectVersion).toString();
      if (!semver.valid(projectVersion)) {
        return {
          ...newMetaEdProjectMetadata(projectPath),
          invalidProject: true,
          invalidProjectReason: 'metaEdProject.projectVersion is not a valid version declaration',
        };
      }

      return {
        ...newMetaEdProjectMetadata(projectPath),
        projectName: projectFileData.projectName,
        projectVersion,
        projectNamespace,
        isExtensionProject: projectNamespace !== 'edfi',
        projectExtension: projectNamespace === 'edfi' ? '' : 'EXTENSION',
      };
    }),
  );
  return result;
}
