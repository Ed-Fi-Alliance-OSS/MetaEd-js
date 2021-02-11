import path from 'path';
import fs from 'fs-extra';
import { v4 as newUuid } from 'uuid';
// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable } from 'atom';
import {
  getCoreMetaEdSourceDirectory,
  setCoreMetaEdSourceDirectory,
  getTargetDsVersion,
  setTargetDsVersion,
  setTargetOdsApiVersion,
  getTargetOdsApiVersion,
} from './PackageSettings';
import { devEnvironmentCorrectedPath, nextMacroTask } from './Utility';

// keys are ODS/API versions, values are arrays of DS versions supported, as settings enums
const odsApiVersionSupport: Map<string, any[]> = new Map([
  ['2.0.0', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.1.0', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.2.0', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.3.0', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.3.1', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.4.0', [{ value: '2.0.1', description: '2.0.1' }]],
  ['2.5.0', [{ value: '2.2.0', description: '2.2' }]],
  ['2.6.0', [{ value: '2.2.0', description: '2.2' }]],
  ['3.0.0', [{ value: '3.0.0', description: '3.0' }]],
  ['3.1.0', [{ value: '3.1.0', description: '3.1' }]],
  ['3.1.1', [{ value: '3.1.0', description: '3.1' }]],
  ['3.2.0', [{ value: '3.1.0', description: '3.1' }]],
  ['3.3.0', [{ value: '3.2.0', description: '3.2a' }]],
  ['3.4.0', [{ value: '3.2.0-b', description: '3.2b' }]],
  ['5.0.0', [{ value: '3.2.0-c', description: '3.2c' }]],
  ['5.1.0', [{ value: '3.2.0-c', description: '3.2c' }]],
  ['5.2.0', [{ value: '3.3.0-a', description: '3.3a' }]],
]);

async function updateDsVersionEnumsToMatch(targetOdsApiVersion: string) {
  const dsVersionEnums = odsApiVersionSupport.get(targetOdsApiVersion);
  const [dsVersion] = dsVersionEnums == null ? [{ value: '3.0.0', description: '3.0' }] : dsVersionEnums;
  // using any type because this is not an official path
  (atom.config as any).schema.properties['atom-metaed'].properties.targetDsVersion.enum = [dsVersion];

  // to refresh the settings panel with enum changes, need to close and reopen - refresh() and update() aren't enough
  await atom.workspace.getActivePane().destroyActiveItem();
  await atom.workspace.open('atom://config/packages/atom-metaed');
  setTargetDsVersion(dsVersion.value);
}

export function switchCoreDsProjectOptionsOnOdsApiChange(disposableTracker: CompositeDisposable) {
  disposableTracker.add(
    atom.config.onDidChange(
      'atom-metaed.targetOdsApiVersion',
      async ({ newValue }: { oldValue: string; newValue: string }) => {
        await updateDsVersionEnumsToMatch(newValue);
      },
    ),
  );
}

export function switchCoreDsProjectOnDsChange(disposableTracker: CompositeDisposable) {
  disposableTracker.add(
    atom.config.onDidChange('atom-metaed.targetDsVersion', ({ newValue }: { oldValue: string; newValue: string }) => {
      if (newValue === '2.0.1') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-2.0'));
      if (newValue === '2.2.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-2.2'));
      if (newValue === '3.0.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.0'));
      if (newValue === '3.1.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.1'));
      if (newValue === '3.2.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.2a'));
      if (newValue === '3.2.0-b') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.2b'));
      if (newValue === '3.2.0-c') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.2c'));
      if (newValue === '3.3.0-a') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.3a'));
    }),
  );
}

async function setCoreToThreeDotX() {
  setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('ed-fi-model-3.0'));
  setTargetDsVersion('3.0.0');
  setTargetOdsApiVersion('3.0.0');
  await nextMacroTask();
}

// initialize package settings if invalid
export async function initializePackageSettings() {
  if (!getTargetDsVersion()) {
    await setCoreToThreeDotX();
  }
  if (!getCoreMetaEdSourceDirectory() || !(await fs.exists(path.resolve(getCoreMetaEdSourceDirectory())))) {
    await setCoreToThreeDotX();
  }
  if (!atom.config.get('metaed-exception-report.user')) {
    atom.config.set('metaed-exception-report.user', newUuid());
  }
  await updateDsVersionEnumsToMatch(getTargetOdsApiVersion());

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
      `A metaEd.json file is in your project. These files are obsolete, and have been replaced by package.json project files.`,
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

  // remove obsolete path to C# console
  if (atom.config.get('atom-metaed.metaEdConsoleSourceDirectory')) {
    atom.config.unset('atom-metaed.metaEdConsoleSourceDirectory');
  }

  // remove obsolete path to JS console - it's hardcoded now
  if (atom.config.get('atom-metaed.metaEdJsConsoleSourceDirectory')) {
    atom.config.unset('atom-metaed.metaEdJsConsoleSourceDirectory');
  }

  // warn that MetaEdOutput-Experimental folder from 1.1.x versions is no longer used
  disposableTracker.add(
    atom.project.onDidChangePaths((projectPaths: string[]) => {
      projectPaths.forEach(async projectPath => warnOnExperimentalFolderExistence(projectPath));
    }),
  );

  // warn that metaEd.json from pre-1.2 versions is obsolete
  disposableTracker.add(
    atom.project.onDidChangePaths((projectPaths: string[]) => {
      projectPaths.forEach(async projectPath => warnOnMetaEdJsonExistence(projectPath));
    }),
  );
}
