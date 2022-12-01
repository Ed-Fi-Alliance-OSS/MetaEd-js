// eslint-disable-next-line import/no-unresolved
import { commands, workspace, window, ExtensionContext } from 'vscode';
import R from 'ramda';
import path from 'path';
import debounce from 'p-debounce';
import { MetaEdConfiguration, newMetaEdConfiguration } from '@edfi/metaed-core';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { findMetaEdProjectMetadataForClient } from './Projects';
import { AboutPanel } from './AboutPanel';
import { MetaEdProjectMetadata, validProjectMetadata } from '../common/Projects';

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

export async function launchServer(context: ExtensionContext) {
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

  client.onNotification('metaed/buildComplete', () => {
    (async () => {
      await window.showInformationMessage('MetaEd Build Complete');
    })();
  });
}

export async function activate(context: ExtensionContext) {
  // eslint-disable-next-line no-console
  console.log(`${Date.now()}: Activating vscode-metaed extension`);

  context.subscriptions.push(
    commands.registerCommand('metaed.build', () => {
      (async () => {
        await window.showInformationMessage('Building MetaEd...');
        const metaEdConfiguration = await createMetaEdConfiguration();
        await client.sendNotification('metaed/build', metaEdConfiguration);
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
    window.onDidChangeActiveTextEditor((editor) => {
      if (editor == null) return;
      // eslint-disable-next-line no-console
      console.log(`${Date.now()}: client onDidChangeActiveTextEditor sending lint command to server`);
      (async () => {
        await sendLintCommandToServer();
      })();
    }),
  );

  context.subscriptions.push(
    workspace.onDidChangeTextDocument((editor) => {
      if (editor != null) {
        // eslint-disable-next-line no-console
        console.log(`${Date.now()}: client onDidChangeTextDocument sending lint command to server`);
        (async () => {
          await sendLintCommandToServer();
        })();
      }
    }),
  );

  context.subscriptions.push(
    workspace.onDidCloseTextDocument((editor) => {
      if (editor != null) {
        // eslint-disable-next-line no-console
        console.log(`${Date.now()}: client onDidCloseTextDocument sending lint command to server`);
        (async () => {
          await sendLintCommandToServer();
        })();
      }
    }),
  );

  await launchServer(context);

  // Trigger an initial lint after extension startup is complete
  if (window.activeTextEditor != null) {
    await sendLintCommandToServer();
  }
}

export function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop() as Promise<void>;
}
