// eslint-disable-next-line import/no-unresolved
import { URI } from 'vscode-uri';
import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
} from 'vscode-languageserver';
import { State, MetaEdConfiguration, executePipeline, newState, newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdProjectMetadata, validProjectMetadata, findMetaEdProjectMetadata } from '../common/Projects';

export async function findMetaEdProjectMetadataForServer(workspaceFolders: string[]): Promise<MetaEdProjectMetadata[]> {
  return findMetaEdProjectMetadata(workspaceFolders.map((folderUri) => URI.parse(folderUri).fsPath));
}

const connection = createConnection(ProposedFeatures.all);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;

const documents: TextDocuments = new TextDocuments();

const workspaceFolders: Set<string> = new Set();
let currentFilesWithFailures: string[] = [];

async function createMetaEdConfiguration(
  metaEdProjectMetadata: MetaEdProjectMetadata[],
): Promise<MetaEdConfiguration | undefined> {
  if (!validProjectMetadata(metaEdProjectMetadata)) return undefined;

  const metaEdConfiguration: MetaEdConfiguration = {
    ...newMetaEdConfiguration(),
    defaultPluginTechVersion: '3.3.0',
    allianceMode: false,
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

async function validateFiles(): Promise<void> {
  const metaEdProjectMetadata: MetaEdProjectMetadata[] = await findMetaEdProjectMetadataForServer(
    Array.from(workspaceFolders),
  );
  const metaEdConfiguration: MetaEdConfiguration | undefined = await createMetaEdConfiguration(metaEdProjectMetadata);
  if (metaEdConfiguration == null) return;

  const state: State = {
    ...newState(),
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: false,
      stopOnValidationFailure: false,
    },
    metaEdConfiguration,
  };
  state.metaEd.dataStandardVersion = '3.2.0';

  const { validationFailure } = (await executePipeline(state)).state;

  const filesWithFailure: Map<string, Diagnostic[]> = new Map();

  validationFailure.forEach((failure) => {
    if (failure.fileMap != null) {
      const fileUri = URI.file(failure.fileMap.fullPath);
      if (!filesWithFailure.has(fileUri.toString())) {
        filesWithFailure.set(fileUri.toString(), []);
      }

      const tokenLength: number = failure.sourceMap && failure.sourceMap.tokenText ? failure.sourceMap.tokenText.length : 0;
      const adjustedLine: number = !failure.fileMap || failure.fileMap.lineNumber === 0 ? 0 : failure.fileMap.lineNumber - 1;
      const characterPosition: number = failure.sourceMap ? failure.sourceMap.column : 0;

      const diagnostics: Diagnostic[] = [];

      const diagnostic: Diagnostic = {
        severity: failure.category === 'warning' ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
        range: {
          start: { line: adjustedLine, character: characterPosition },
          end: { line: adjustedLine, character: characterPosition + tokenLength },
        },
        message: failure.message,
        source: 'MetaEd',
      };

      const fileWithFailureDiagnostics = filesWithFailure.get(fileUri.toString());
      if (fileWithFailureDiagnostics != null) fileWithFailureDiagnostics.push(diagnostic);
      connection.sendDiagnostics({ uri: fileUri.toString(), diagnostics });
    }
  });

  // send failures
  filesWithFailure.forEach((diagnostics: Diagnostic[], uri: string) => {
    connection.sendDiagnostics({ uri, diagnostics });
  });

  // clear resolved failures
  const resolvedFailures = [...currentFilesWithFailures].filter((fileUri) => filesWithFailure.has(fileUri));
  resolvedFailures.forEach((uri) => {
    connection.sendDiagnostics({ uri, diagnostics: [] });
  });
  currentFilesWithFailures = Array.from(filesWithFailure.keys());
}

connection.onNotification('metaed/build', async (metaEdConfiguration: MetaEdConfiguration) => {
  const state: State = {
    ...newState(),
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
      stopOnValidationFailure: true,
    },
    metaEdConfiguration,
  };
  state.metaEd.dataStandardVersion = '3.2.0';

  await executePipeline(state);

  connection.sendNotification('metaed/buildComplete');
});

connection.onInitialize((params: InitializeParams) => {
  const { capabilities } = params;

  hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
  hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

  return {
    capabilities: {
      completionProvider: {},
      workspaceFolders: {
        supported: true,
        changeNotifications: true,
      },
    },
  };
});

connection.onInitialized(async () => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((event) => {
      connection.console.log('Workspace folder change event received.');
      event.removed.forEach((workspaceFolder) => {
        workspaceFolders.delete(workspaceFolder.uri);
      });
      event.added.forEach((workspaceFolder) => {
        workspaceFolders.add(workspaceFolder.uri);
      });
    });
    const currentWorkspaceFolders = await connection.workspace.getWorkspaceFolders();
    if (currentWorkspaceFolders != null) {
      currentWorkspaceFolders.forEach((workspaceFolder) => {
        workspaceFolders.add(workspaceFolder.uri);
      });
    }
  }
  await validateFiles();
});

function clearDiagnostics() {
  currentFilesWithFailures.forEach((uri) => {
    connection.sendDiagnostics({ uri, diagnostics: [] });
  });
  currentFilesWithFailures = [];
}

documents.onDidOpen(async () => {
  clearDiagnostics();
  await validateFiles();
});

// Lint on save only - not on the fly - works well with editor autosave
documents.onDidSave(async () => {
  clearDiagnostics();
  await validateFiles();
});

documents.onDidClose(async () => {
  clearDiagnostics();
  await validateFiles();
});

// Make text document manager listen
documents.listen(connection);

// Make connection listen
connection.listen();
