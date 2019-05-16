// Get regeneratorRuntime async/await polyfill
import 'babel-polyfill';
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
  ensureWarningsOnDsAndOdsApiMismatch,
  switchCoreDsProjectOnDsChange,
} from './ManageConfiguration';
import { MetaEdAboutModel, metaEdAboutView } from './MetaEdAbout';
import { updateEditorIfCore, addCopyBackToCore } from './MakeCoreTabsReadOnly';
import { linterConfiguration } from './LinterProvider';
import { allianceMode } from './PackageSettings';
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
  // ensure our Atom package dependencies are installed
  await packageDepsInstall('atom-metaed', true);

  disposableTracker = new CompositeDisposable();
  outputWindow = new OutputWindow();

  const packageJson: any = atomMetaEdPackageJson();
  atom.notifications.addInfo(
    `<b>MetaEd ${
      packageJson != null ? `v${packageJson.version}` : ''
    }</b><br />MetaEd is ©2019 Ed-Fi Alliance, LLC.<br />Click <a href="https://techdocs.ed-fi.org/display/METAED/Getting+Started+-+Licensing">here</a> for license information.`,
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
  ensureWarningsOnDsAndOdsApiMismatch(disposableTracker);
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
    atom.config.observe(
      'atom-metaed.coreMetaEdSourceDirectory',
      (): void => {
        updateCoreMetaEdSourceDirectory();
      },
    ),
  );

  if (!allianceMode()) {
    disposableTracker.add(
      atom.workspace.observeTextEditors((editor: TextEditor) => {
        updateEditorIfCore(editor);
      }),
    );
    disposableTracker.add(
      atom.commands.add('atom-text-editor', {
        'core:copy': commandEvent => addCopyBackToCore(commandEvent),
      }),
    );
  }

  disposableTracker.add(atom.views.addViewProvider(MetaEdAboutModel, metaEdAboutView()));
  disposableTracker.add(
    atom.workspace.addOpener(uri => {
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
