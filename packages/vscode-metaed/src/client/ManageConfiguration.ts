// eslint-disable-next-line import/no-unresolved
import { ConfigurationChangeEvent, OutputChannel, Uri, workspace, window, ExtensionContext } from 'vscode';
import * as path from 'path';
import fs from 'fs-extra';
import {
  setCoreMetaEdSourceDirectory,
  getTargetDsVersion,
  setTargetDsVersion,
  getTargetOdsApiVersion,
  setTargetOdsApiVersion,
  getCoreMetaEdSourceDirectory,
} from './PackageSettings';
import { devEnvironmentCorrectedPath, yieldToNextMacroTask } from './Utility';

export type InitializePackageSettingsResult = { restarting: boolean };

// keys are ODS/API versions, values are corresponding DS versions supported
const odsApiToDsVersion: Map<string, string> = new Map([
  ['3.0.0', '3.0.0'],
  ['3.1.0', '3.1.0'],
  ['3.1.1', '3.1.0'],
  ['3.2.0', '3.1.0'],
  ['3.3.0', '3.2.0'],
  ['3.4.0', '3.2.0-b'],
  ['5.0.0', '3.2.0-c'],
  ['5.1.0', '3.2.0-c'],
  ['5.2.0', '3.3.0-a'],
  ['5.3.0', '3.3.1-b'],
  ['6.0.0', '4.0.0-a'],
  ['6.1.0', '4.0.0'],
]);

export async function switchCoreDsProjectOnDsChange(context: ExtensionContext, logOutputChannel: OutputChannel) {
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async (event: ConfigurationChangeEvent) => {
      if (!event.affectsConfiguration('metaed.targetDataStandardVersion')) return;

      await yieldToNextMacroTask();
      const newTargetDsVersion: string = getTargetDsVersion();

      let modelName = '';
      let modelPath = '';

      try {
        switch (newTargetDsVersion) {
          case '3.0.0':
            modelName = 'Ed-Fi-Model 3.0';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.0');
            break;
          case '3.1.0':
            modelName = 'Ed-Fi-Model 3.1';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.1');
            break;
          case '3.2.0':
            modelName = 'Ed-Fi-Model 3.2a';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2a');
            break;
          case '3.2.0-b':
            modelName = 'Ed-Fi-Model 3.2b';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2b');
            break;
          case '3.2.0-c':
            modelName = 'Ed-Fi-Model 3.2c';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2c');
            break;
          case '3.3.0-a':
            modelName = 'Ed-Fi-Model 3.3a';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3a');
            break;
          case '3.3.1-b':
            modelName = 'Ed-Fi-Model 3.3b';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3b');
            break;
          case '4.0.0-a':
            modelName = 'Ed-Fi-Model 4.0a';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0a');
            break;
          case '4.0.0':
            modelName = 'Ed-Fi-Model 4.0';
            modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0');
            break;
          default:
            return;
        }

        // eslint-disable-next-line no-void
        void window.showInformationMessage('MetaEd is switching Data Standard projects and will restart. Please wait.');
        await yieldToNextMacroTask();

        await setCoreMetaEdSourceDirectory(modelPath);

        workspace.updateWorkspaceFolders(0, workspace.workspaceFolders == null ? 0 : workspace.workspaceFolders.length, {
          name: modelName,
          uri: Uri.file(modelPath),
        });
      } catch (e) {
        logOutputChannel.appendLine(`Exception: ${e}`);
      } finally {
        await yieldToNextMacroTask();
      }
    }),
  );
}

/**
 * Trigger a VS Code workspace folder update.
 *
 * @param name The VS Code name for the workspace folder
 * @param uri The file URI for the folder
 */
async function triggerWorkspaceFolderUpdate(name: string, uri: Uri) {
  workspace.updateWorkspaceFolders(0, workspace.workspaceFolders == null ? 0 : workspace.workspaceFolders.length, {
    name,
    uri,
  });
}

/**
 * Updates MetaEd settings and VS Code workspace to target ODS/API 6.x (the current default)
 */
async function setCoreToSixDotX(): Promise<InitializePackageSettingsResult> {
  const folderName = 'Ed-Fi-Model 4.0';
  const modelPath = devEnvironmentCorrectedPath('@edfi/ed-fi-model-4.0');
  const folderUri = Uri.file(modelPath);

  if (workspace.workspaceFolders == null) {
    // eslint-disable-next-line no-void
    void window.showInformationMessage('MetaEd is modifying the workspace. Please wait.');
    await yieldToNextMacroTask();
    await triggerWorkspaceFolderUpdate(folderName, folderUri);
    return { restarting: true };
  }

  // Intentionally not using `await` on the next line, as it causes unexpected behavior when trying to use MetaEd commands
  // eslint-disable-next-line no-void
  void window.showInformationMessage('MetaEd is switching Data Standard projects and will restart. Please wait.');
  await yieldToNextMacroTask();

  await triggerWorkspaceFolderUpdate(folderName, folderUri);

  await yieldToNextMacroTask();

  await setCoreMetaEdSourceDirectory(modelPath);
  await setTargetDsVersion('4.0.0');
  await setTargetOdsApiVersion('6.1.0');

  await yieldToNextMacroTask();
  return { restarting: false };
}

export function switchCoreDsProjectOnOdsApiChange(logOutputChannel: OutputChannel) {
  workspace.onDidChangeConfiguration(async (event: ConfigurationChangeEvent) => {
    try {
      if (!event.affectsConfiguration('metaed.targetOdsApiVersion')) return;
      await yieldToNextMacroTask();

      const newTargetOdsApiVersion: string = getTargetOdsApiVersion();
      const newTargetDsVersion: string | undefined = odsApiToDsVersion.get(newTargetOdsApiVersion);
      if (newTargetDsVersion != null) {
        await setTargetDsVersion(newTargetDsVersion);
      }
    } catch (e) {
      logOutputChannel.appendLine(`Exception: ${e}`);
    }
  });
}

/**
 * Initialize package settings if the current ones are invalid
 */
export async function initializePackageSettings(): Promise<InitializePackageSettingsResult> {
  if (
    getTargetDsVersion() === '' ||
    getCoreMetaEdSourceDirectory() === '' ||
    !(await fs.exists(path.resolve(getCoreMetaEdSourceDirectory())))
  ) {
    return setCoreToSixDotX();
  }

  return { restarting: false };
}
