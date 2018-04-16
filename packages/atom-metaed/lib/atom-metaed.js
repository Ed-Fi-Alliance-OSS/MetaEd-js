/** @babel */
// @flow

// Get regeneratorRuntime async/await polyfill
import 'babel-polyfill';
import { install as packageDepsInstall } from 'atom-package-deps';

// eslint-disable-next-line
import { CompositeDisposable } from 'atom';
import { hideTreeViewContextMenuOperationsWhenCore } from './ContextMenuHider';
import reportException from './ExceptionReporter';
import OutputWindow from './OutputWindow';
import { updateCoreMetaEdSourceDirectory } from './CoreSourceDirectoryUpdater';
import {
  manageLegacyIssues,
  initializePackageSettings,
  ensureLinterUiSettings,
  ensureWarningsOnDsAndOdsApiMismatch,
} from './ManageConfiguration';
import { MetaEdAboutModel, metaEdAboutView } from './MetaEdAbout';
import { updateEditorIfCore, addCopyBackToCore } from './MakeCoreTabsReadOnly';
import { linterConfiguration } from './LinterProvider';
import { allianceMode } from './PackageSettings';
import { initializeCommands } from './CommandInitializer';

let outputWindow: ?OutputWindow;
let disposableTracker: ?CompositeDisposable;

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

  atom.notifications.addInfo(
    'MetaEd is ©2018 Ed-Fi Alliance, LLC.<br />Click <a href="https://techdocs.ed-fi.org/display/METAED/Getting+Started+-+Licensing">here</a> for license information.',
    { dismissable: true },
  );
  if (allianceMode()) {
    atom.notifications.addWarning(
      'This is an Ed-Fi Alliance only version of MetaEd and is not suitable for extension authoring.',
      { dismissable: true },
    );
  }

  await manageLegacyIssues(disposableTracker);
  await initializePackageSettings();
  await ensureLinterUiSettings();
  ensureWarningsOnDsAndOdsApiMismatch(disposableTracker);

  if (!allianceMode()) hideTreeViewContextMenuOperationsWhenCore();

  initializeCommands(disposableTracker, outputWindow);

  disposableTracker.add(
    atom.onWillThrowError(({ originalError, preventDefault }) => {
      reportError(originalError);
      preventDefault();
    }),
  );

  if (atom.onDidFailAssertion != null) {
    disposableTracker.add(atom.onDidFailAssertion(error => reportError(error)));
  }

  disposableTracker.add(
    atom.config.observe('atom-metaed.coreMetaEdSourceDirectory', () => {
      updateCoreMetaEdSourceDirectory();
    }),
  );

  if (!allianceMode()) {
    disposableTracker.add(
      atom.workspace.observeTextEditors((editor: AtomTextEditor) => {
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
      if (uri !== 'atom-metaed://about') return null;
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
