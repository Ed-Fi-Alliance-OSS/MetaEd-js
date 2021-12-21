// Get regeneratorRuntime async/await polyfill
import { install as packageDepsInstall } from 'atom-package-deps';

// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable, TextEditor } from 'atom';
import { hideTreeViewContextMenuOperationsWhenCore } from './ContextMenuHider';
import reportException from './ExceptionReporter';
import { OutputWindow } from './OutputWindow';
import { updateCoreMetaEdSourceDirectory } from './CoreSourceDirectoryUpdater';
import {
  manageLegacyIssues,
  initializePackageSettings,
  ensureLinterUiSettings,
  switchCoreDsProjectOnDsChange,
  switchCoreDsProjectOptionsOnOdsApiChange,
} from './ManageConfiguration';
import { MetaEdAboutModel, metaEdAboutView, LICENSE_URL } from './MetaEdAbout';
import { updateEditorIfCore, addCopyBackToCore } from './MakeCoreTabsReadOnly';
import { linterConfiguration } from './LinterProvider';
import { allianceMode, acceptedLicense, setAcceptedLicense } from './PackageSettings';
import { initializeCommands } from './CommandInitializer';
import { atomMetaEdPackageJson } from './Utility';

let outputWindow: OutputWindow | null;
let disposableTracker: CompositeDisposable | null;

function reportError(error) {
  try {
    console.log('Reporting exception', error);
    reportException(error);
  } catch (secondaryException) {
    try {
      console.log('Reporting secondary exception', secondaryException);
      reportException(secondaryException);
    } catch (unreportedError) {
      console.log('Unable to report exception', unreportedError);
    }
  }
}

export async function activate() {
  // Enforce license acceptance
  if (!acceptedLicense()) {
    const dialog = atom.notifications.addInfo(
      `Usage of the MetaEd IDE requires acceptance of the Ed-Fi License. <br />Click <a href="${LICENSE_URL}">here</a> for license information.`,
      {
        description: 'Select whether you accept the license terms.',
        dismissable: true,
        buttons: [
          {
            text: 'Accept',
            onDidClick: async () => {
              if (dialog) dialog.dismiss();
              setAcceptedLicense();
              setImmediate(() => activate());
            },
          },
          {
            text: 'Do not accept',
            onDidClick: () => {
              if (dialog) dialog.dismiss();
            },
          },
        ],
      },
    );
    // Terminate activate() here
    return;
  }

  // ensure our Atom package dependencies are installed
  await packageDepsInstall('atom-metaed', true);

  disposableTracker = new CompositeDisposable();
  outputWindow = new OutputWindow();

  const packageJson: any = atomMetaEdPackageJson();
  atom.notifications.addInfo(
    `<b>MetaEd ${
      packageJson != null ? `v${packageJson.version}` : ''
    }</b><br />MetaEd is &copy; 2021 Ed-Fi Alliance, LLC.<br />Click <a href="${LICENSE_URL}">here</a> for license information.`,
    {
      dismissable: true,
      icon: 'info',
    },
  );
  if (allianceMode()) {
    atom.notifications.addWarning(
      'This is an Ed-Fi Alliance only mode of MetaEd and is not suitable for extension authoring.',
      {
        dismissable: true,
        icon: 'shield',
      },
    );
  }

  await manageLegacyIssues(disposableTracker);
  await initializePackageSettings();
  await ensureLinterUiSettings();
  switchCoreDsProjectOptionsOnOdsApiChange(disposableTracker);
  switchCoreDsProjectOnDsChange(disposableTracker);

  if (!allianceMode()) hideTreeViewContextMenuOperationsWhenCore();

  initializeCommands(disposableTracker, outputWindow);

  disposableTracker.add(
    atom.onWillThrowError(({ originalError, preventDefault }) => {
      reportError(originalError);
      preventDefault();
    }),
  );

  disposableTracker.add(
    atom.config.observe('atom-metaed.coreMetaEdSourceDirectory', (): void => {
      updateCoreMetaEdSourceDirectory();
    }),
  );

  if (!allianceMode()) {
    disposableTracker.add(
      atom.workspace.observeTextEditors((editor: TextEditor) => {
        updateEditorIfCore(editor);
      }),
    );
    disposableTracker.add(
      atom.commands.add('atom-text-editor', {
        'core:copy': (commandEvent) => addCopyBackToCore(commandEvent),
      }),
    );
  }

  disposableTracker.add(atom.views.addViewProvider(MetaEdAboutModel, metaEdAboutView()));
  disposableTracker.add(
    atom.workspace.addOpener((uri) => {
      if (uri !== 'atom-metaed://about') return undefined;
      return new MetaEdAboutModel();
    }),
  );
}

export function deactivate() {
  if (outputWindow) {
    outputWindow.dispose();
  }
  outputWindow = null;
  if (disposableTracker) {
    disposableTracker.dispose();
  }
  disposableTracker = null;
}

export function serialize() {}

export function provideLinter() {
  return linterConfiguration();
}
