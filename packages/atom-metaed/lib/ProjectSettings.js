/** @babel */
// @flow

import fs from 'fs-extra';
import path from 'path';
import { packageJsonTemplate } from './ProjectTemplates';

const PROJECT_SETTINGS_FILE_NAME: string = 'package.json';

export type MetaEdProject = {
  projectName: string,
  projectVersion: string,
};

export async function newProjectJson(projectPath: string): Promise<void> {
  const configTemplate: string = packageJsonTemplate('Extension', '1.0.0');
  const newFilePath = path.join(projectPath, PROJECT_SETTINGS_FILE_NAME);
  await fs.writeFile(newFilePath, configTemplate);
  const notification = atom.notifications.addInfo(
    `A package.json file with default name 'Extension' has been created for your project.`,
    {
      dismissable: true,
      buttons: [
        {
          text: 'Edit File',
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

export async function ensureProjectJsonExists(projectPath: string): Promise<string> {
  const projectJsonFilePath = path.join(projectPath, PROJECT_SETTINGS_FILE_NAME);
  if (!await fs.exists(projectJsonFilePath)) {
    await newProjectJson(projectPath);
  }
  return projectJsonFilePath;
}
