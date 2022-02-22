import path from 'path';
import fs from 'fs-extra';
import { v4 as newUuid } from 'uuid';
// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable, Emitter } from 'atom';
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
  ['5.3.0', [{ value: '3.3.1-b', description: '3.3b' }]],
  ['5.4.0', [{ value: '3.3.1-b', description: '3.3b' }]], // TODO: This DS version is a 5.4 placeholder - real version TBD
]);

// Used to schedule an update to the DS version in the settings after the DS version dropdown is re-written
const updateDsVersionEmitter = new Emitter();
updateDsVersionEmitter.on('did-update-ds-version-dropdown', (dsVersionSemver: string) => {
  setTargetDsVersion(dsVersionSemver);
});

async function updateDsVersionEnumsToMatch(odsApiVersion: string) {
  const dsVersionEnums = odsApiVersionSupport.get(odsApiVersion);
  if (dsVersionEnums == null) return;
  const [dsVersion] = dsVersionEnums;

  // atom.config.schema is not an official path in the typings file
  (atom.config as any).schema.properties['atom-metaed'].properties.targetDsVersion.enum = [dsVersion];

  // to refresh the settings panel with enum changes, need to close and reopen - refresh() and update() aren't enough
  await atom.workspace.getActivePane().destroyActiveItem();
  await atom.workspace.open('atom://config/packages/atom-metaed');

  // schedule update to config settings - can't be done in this "thread"
  updateDsVersionEmitter.emit('did-update-ds-version-dropdown', dsVersion.value);
}

export function switchCoreDsProjectOptionsOnOdsApiChange(disposableTracker: CompositeDisposable) {
  disposableTracker.add(
    atom.config.onDidChange('atom-metaed.targetOdsApiVersion', async (valueChanges) => {
      await updateDsVersionEnumsToMatch(valueChanges.newValue);
    }),
  );
}

export function switchCoreDsProjectOnDsChange(disposableTracker: CompositeDisposable) {
  disposableTracker.add(
    atom.config.onDidChange('atom-metaed.targetDsVersion', ({ newValue }: { oldValue: string; newValue: string }) => {
      if (newValue === '2.0.1') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-2.0'));
      if (newValue === '2.2.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-2.2'));
      if (newValue === '3.0.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.0'));
      if (newValue === '3.1.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.1'));
      if (newValue === '3.2.0') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2a'));
      if (newValue === '3.2.0-b') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2b'));
      if (newValue === '3.2.0-c') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.2c'));
      if (newValue === '3.3.0-a') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3a'));
      if (newValue === '3.3.1-b') setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3b'));
    }),
  );
}

async function setCoreToFiveDotX() {
  // TODO: These DS version entries are 5.4 placeholders - real version TBD
  setCoreMetaEdSourceDirectory(devEnvironmentCorrectedPath('@edfi/ed-fi-model-3.3b'));
  setTargetDsVersion('3.3.1-b');
  setTargetOdsApiVersion('5.4.0');
  await nextMacroTask();
}

// initialize package settings if invalid
export async function initializePackageSettings() {
  if (!getTargetDsVersion()) {
    await setCoreToFiveDotX();
  }
  if (!getCoreMetaEdSourceDirectory() || !(await fs.exists(path.resolve(getCoreMetaEdSourceDirectory())))) {
    await setCoreToFiveDotX();
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
    setCoreToFiveDotX();
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
      projectPaths.forEach(async (projectPath) => warnOnExperimentalFolderExistence(projectPath));
    }),
  );

  // warn that metaEd.json from pre-1.2 versions is obsolete
  disposableTracker.add(
    atom.project.onDidChangePaths((projectPaths: string[]) => {
      projectPaths.forEach(async (projectPath) => warnOnMetaEdJsonExistence(projectPath));
    }),
  );
}
