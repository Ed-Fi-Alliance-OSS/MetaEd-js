/* eslint-disable import/no-unresolved */
import { commands, workspace, window, ExtensionContext, TextDocumentChangeEvent, TextEditor, TextDocument } from 'vscode';
import R from 'ramda';
import path from 'path';
import debounce from 'p-debounce';
import { MetaEdConfiguration, newMetaEdConfiguration } from '@edfi/metaed-core';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { findMetaEdProjectMetadataForClient } from './Projects';
import { AboutPanel } from './AboutPanel';
import { MetaEdProjectMetadata, validProjectMetadata } from '../common/Projects';
import {
  initializePackageSettings,
  InitializePackageSettingsResult,
  switchCoreDsProjectOnDsChange,
  switchCoreDsProjectOnOdsApiChange,
} from './ManageConfiguration';
import { yieldToNextMacroTask } from './Utility';

let client: LanguageClient;

const sendLintCommandToServer: () => Promise<void> = debounce(async () => {
  await client.sendNotification('metaed/lint');
}, 500);

async function createMetaEdConfiguration(): Promise<MetaEdConfiguration | undefined> {
  const metaEdProjectMetadata: MetaEdProjectMetadata[] = await findMetaEdProjectMetadataForClient();
  if (!validProjectMetadata(metaEdProjectMetadata)) return undefined;

  const lastProjectPath = workspace.workspaceFolders ? R.last(workspace.workspaceFolders).uri.fsPath : '';

  const metaEdConfiguration: MetaEdConfiguration = {
    ...newMetaEdConfiguration(),
    defaultPluginTechVersion: '6.1.0',
    allianceMode: false,
    artifactDirectory: path.join(lastProjectPath, 'MetaEdOutput'),
  };

  metaEdProjectMetadata.forEach((pm) => {
    metaEdConfiguration.projects.push({
      namespaceName: pm.projectNamespace,
      projectName: pm.projectName,
      projectVersion: pm.projectVersion,
      projectExtension: pm.projectExtension,
      description: pm.projectDescription,
    });
    metaEdConfiguration.projectPaths.push(pm.projectPath);
  });

  return metaEdConfiguration;
}

/**
 * True if both the file part of a MetaEd project (associated with the MetaEd extension) and ends in .metaed
 */
function isDotMetaEdFile(document: TextDocument): boolean {
  return document?.languageId === 'metaed' && document.uri.path.endsWith('.metaed');
}

/**
 * Adds event subscriptions for MetaEd VS Code command and document/editor listeners
 */
async function addSubscriptions(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('metaed.build', () => {
      (async () => {
        const metaEdConfiguration = await createMetaEdConfiguration();
        await client.sendNotification('metaed/build', metaEdConfiguration);

        // eslint-disable-next-line no-void
        void window.showInformationMessage('Building MetaEd...');
        await yieldToNextMacroTask();
      })();
    }),
  );

  context.subscriptions.push(
    commands.registerCommand('metaed.lint', () => {
      (async () => {
        await sendLintCommandToServer();
      })();
    }),
  );

  // About Panel
  context.subscriptions.push(
    commands.registerCommand('metaed.about', () => {
      AboutPanel.createOrShow(context.extensionPath);
    }),
  );

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor((textEditor: TextEditor | undefined) => {
      if (textEditor != null && isDotMetaEdFile(textEditor.document)) {
        client.outputChannel.appendLine(`${Date.now()}: client onDidChangeActiveTextEditor sending lint command to server`);
        (async () => {
          await sendLintCommandToServer();
        })();
      }
    }),
  );

  context.subscriptions.push(
    workspace.onDidChangeTextDocument((changeEvent: TextDocumentChangeEvent) => {
      if (isDotMetaEdFile(changeEvent.document)) {
        client.outputChannel.appendLine(`${Date.now()}: client onDidChangeTextDocument sending lint command to server`);
        (async () => {
          await sendLintCommandToServer();
        })();
      }
    }),
  );

  context.subscriptions.push(
    workspace.onDidCloseTextDocument((textDocument: TextDocument) => {
      if (isDotMetaEdFile(textDocument)) {
        client.outputChannel.appendLine(`${Date.now()}: client onDidCloseTextDocument sending lint command to server`);
        (async () => {
          await sendLintCommandToServer();
        })();
      }
    }),
  );
}

/**
 * Extension lifecycle function invoked by VS Code to activate extension
 */
export async function activate(context: ExtensionContext) {
  const serverModule = context.asAbsolutePath(path.join('dist', 'server', 'server.js'));
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  const clientOptions: LanguageClientOptions = {
    // Register the server for metaed documents
    documentSelector: [{ scheme: 'file', language: 'metaed' }],
    synchronize: {
      // Notify the server about file changes to metaed files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.metaed'),
    },
  };

  // Start the client. This will also launch the server
  client = new LanguageClient('MetaEd', 'MetaEd', serverOptions, clientOptions);
  await client.start();

  client.outputChannel.appendLine(`${Date.now()}: MetaEd extension is starting...`);

  await addSubscriptions(context);

  context.subscriptions.push(
    client.onNotification('metaed/buildComplete', (failure: boolean) => {
      (async () => {
        if (failure) {
          // eslint-disable-next-line no-void
          void window.showInformationMessage('MetaEd build failure - see Problems window');
          await commands.executeCommand('workbench.action.problems.focus');
        } else {
          // eslint-disable-next-line no-void
          void window.showInformationMessage(`MetaEd build success: Find results in 'MetaEdOutput' folder.`);
          await yieldToNextMacroTask();
        }
      })();
    }),
  );

  // Trigger an initial lint after extension startup is complete
  if (window.activeTextEditor != null) {
    await sendLintCommandToServer();
  }

  const initializePackageSettingsResult: InitializePackageSettingsResult = await initializePackageSettings();
  if (initializePackageSettingsResult.restarting) {
    client.outputChannel.appendLine('MetaEd will restart');
    return;
  }

  switchCoreDsProjectOnOdsApiChange(client.outputChannel);
  await switchCoreDsProjectOnDsChange(context, client.outputChannel);

  client.outputChannel.appendLine('MetaEd has started 🎬');
  // eslint-disable-next-line no-void
  void window.showInformationMessage('MetaEd has started 🎬');
  await yieldToNextMacroTask();
}

/**
 * Extension lifecycle function invoked by VS Code to deactivate extension
 */
export function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop() as Promise<void>;
}
