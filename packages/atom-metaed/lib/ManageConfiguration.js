/** @babel */
// @flow
import path from 'path';
import fs from 'fs-extra';
import { v4 as newUuid } from 'uuid';
// eslint-disable-next-line
import { CompositeDisposable } from 'atom';
import {
  getCoreMetaEdSourceDirectory,
  setCoreMetaEdSourceDirectory,
  getMetaEdConsoleSourceDirectory,
  setMetaEdConsoleSourceDirectory,
  getMetaEdJsConsoleSourceDirectory,
  setMetaEdJsConsoleSourceDirectory,
  getTargetDsVersion,
  setTargetDsVersion,
  getTargetOdsApiVersion,
  setTargetOdsApiVersion,
} from './PackageSettings';
import { devEnviromentCorrectedPath, nextMacroTask } from './Utility';

// keys are ODS/API versions, values are arrays of DS versions supported
const odsApiVersionSupport: Map<string, Array<string>> = new Map([
  ['2.0', ['2.0.1']],
  ['2.1', ['2.0.1']],
  ['2.2', ['2.0.1']],
  ['2.3.1', ['2.0.1']],
  ['3.0', ['3.0']],
]);

export function switchCoreDsProjectOnDsChange(disposableTracker: CompositeDisposable) {
  disposableTracker.add(
    atom.config.observe('atom-metaed.targetDsVersion', (targetDsVersion: string) => {
      if (targetDsVersion === '2.0.1') setCoreMetaEdSourceDirectory(devEnviromentCorrectedPath('ed-fi-model-2.0'));
      if (targetDsVersion === '3.0') setCoreMetaEdSourceDirectory(devEnviromentCorrectedPath('ed-fi-model-3.0'));
    }),
  );
}

async function setCoreToTwoDotX() {
  setCoreMetaEdSourceDirectory(devEnviromentCorrectedPath('ed-fi-model-2.0'));
  setTargetDsVersion('2.0.1');
  setTargetOdsApiVersion('2.3.1');
  await nextMacroTask();
}

async function setCoreToThreeDotX() {
  setCoreMetaEdSourceDirectory(devEnviromentCorrectedPath('ed-fi-model-3.0'));
  setTargetDsVersion('3.0');
  setTargetOdsApiVersion('3.0');
  await nextMacroTask();
}

// initialize package settings if invalid
export async function initializePackageSettings() {
  if (!getTargetDsVersion()) {
    await setCoreToTwoDotX();
  }
  if (!getCoreMetaEdSourceDirectory() || !await fs.exists(path.resolve(getCoreMetaEdSourceDirectory()))) {
    await setCoreToTwoDotX();
  }
  if (!getMetaEdConsoleSourceDirectory() || !await fs.exists(path.resolve(getMetaEdConsoleSourceDirectory()))) {
    setMetaEdConsoleSourceDirectory(devEnviromentCorrectedPath('metaed-csharp'));
  }
  if (!getMetaEdJsConsoleSourceDirectory() || !await fs.exists(path.resolve(getMetaEdJsConsoleSourceDirectory()))) {
    setMetaEdJsConsoleSourceDirectory(devEnviromentCorrectedPath('metaed-console'));
  }

  if (!atom.config.get('metaed-exception-report.user')) {
    atom.config.set('metaed-exception-report.user', newUuid());
  }
  await nextMacroTask();
}

// force linter to show all errors/warnings - both a mitigation to Atom issue #14909
// and to make it easier for new users to start
export async function ensureLinterUiSettings() {
  atom.config.set('linter-ui-default.decorateOnTreeView', 'Files and Directories');
  atom.config.set('linter-ui-default.panelRepresents', 'Entire Project');
  atom.config.set('linter-ui-default.showPanel', true);
  await nextMacroTask();
}

async function warnOnExperimentalFolderExistence(projectPath: string) {
  if (await fs.exists(path.join(projectPath, 'MetaEdOutput-Experimental'))) {
    atom.notifications.addWarning(
      `MetaEdOutput-Experimental is not an output folder in this IDE version, and should be removed to avoid confusion.`,
      {
        dismissable: true,
      },
    );
  }
}

async function warnOnMetaEdJsonExistence(projectPath: string) {
  if (await fs.exists(path.join(projectPath, 'metaEd.json'))) {
    atom.notifications.addWarning(
      `A metaEd.json file is in your project. These files are obsolete, and a package.json project file will be created for you on build.`,
      {
        dismissable: true,
      },
    );
  }
}

export function manageLegacyIssues(disposableTracker: CompositeDisposable) {
  // remove tech preview flag left behind by 1.1.x versions of MetaEd
  if (atom.config.get('atom-metaed.useTechPreview')) {
    atom.config.unset('atom-metaed.useTechPreview');
    setCoreToThreeDotX();
  }

  // warn that MetaEdOutput-Experimental folder from 1.1.x versions is no longer used
  disposableTracker.add(
    atom.project.onDidChangePaths((projectPaths: Array<string>) => {
      projectPaths.forEach(async projectPath => warnOnExperimentalFolderExistence(projectPath));
    }),
  );

  // warn that metaEd.json from pre-1.2 versions is obsolete
  disposableTracker.add(
    atom.project.onDidChangePaths((projectPaths: Array<string>) => {
      projectPaths.forEach(async projectPath => warnOnMetaEdJsonExistence(projectPath));
    }),
  );
}

export function odsApiAndDsCombinationValid(odsApiVersion: string, dsVersion: string): boolean {
  const supportedDsVersions: ?Array<string> = odsApiVersionSupport.get(odsApiVersion);
  if (!supportedDsVersions) return false;
  return supportedDsVersions.includes(dsVersion);
}

function warnOnDsAndOdsApiMismatch() {
  if (!odsApiAndDsCombinationValid(getTargetOdsApiVersion(), getTargetDsVersion())) {
    const notification = atom.notifications.addError(
      `The targeted Ed-Fi Data Standard version is not supported by the targeted Ed-Fi ODS/API version`,
      {
        dismissable: true,
        buttons: [
          {
            text: 'Go to Settings',
            onDidClick: () => {
              atom.workspace.open('atom://config/packages/atom-metaed');
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
}

// warn if DS and ODS/API settings don't match
export function ensureWarningsOnDsAndOdsApiMismatch(disposableTracker: CompositeDisposable) {
  warnOnDsAndOdsApiMismatch();
  disposableTracker.add(atom.config.onDidChange('atom-metaed.targetOdsApiVersion', () => warnOnDsAndOdsApiMismatch()));
  disposableTracker.add(atom.config.onDidChange('atom-metaed.targetDsVersion', () => warnOnDsAndOdsApiMismatch()));
}
