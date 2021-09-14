/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

// eslint-disable-next-line import/no-unresolved
import { Notification, TextEditor } from 'atom';
import R from 'ramda';
import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import path from 'path';
import os from 'os';
import semver from 'semver';
import tmp from 'tmp-promise';
import { spawn } from 'child_process';
import streamSplitter from 'stream-splitter';
import ansihtml from 'ansi-html';
import { MetaEdConfiguration } from 'metaed-core';
import { metaEdConfigurationFor } from './MetaEdConfigurationFactory';
import { MetaEdProjectMetadata } from './Projects';
import { findMetaEdProjectMetadata } from './Projects';
import {
  getMetaEdJsConsoleSourceDirectory,
  getEdfiOdsApiSourceDirectory,
  getCmdFullPath,
  suppressDeleteOnDeploy,
  allianceMode,
  getTargetOdsApiVersionSemver,
  getTargetDsVersionSemver,
} from './PackageSettings';
import { OutputWindow } from './OutputWindow';

interface BuildPaths {
  metaEdConsoleDirectory: string;
  cmdExePath: string;
  metaEdConsolePath: string;
  metaEdDeployPath: string;
}

// collapse directory path in tree-view if exists (workaround for Atom GitHub issue #3365)
async function collapseTreeViewDirectory(pathString: string): Promise<void> {
  const treeViewPackage: any = await atom.packages.activatePackage('tree-view');
  const { treeView } = treeViewPackage.mainModule;
  const directoryEntry = treeView.selectEntryForPath(pathString);
  if (directoryEntry) {
    treeView.collapseDirectory(directoryEntry);
  }
}

async function cleanUpMetaEdArtifacts(artifactDirectory: string, outputWindow: OutputWindow): Promise<boolean> {
  // close all MetaEdOutput tabs
  const panes = atom.workspace.getPanes();
  panes.forEach(pane => {
    pane.getItems().forEach(editor => {
      if (typeof (editor as TextEditor).getPath === 'function') {
        const editorPath: string | undefined = (editor as TextEditor).getPath();
        if (editorPath && editorPath.startsWith(artifactDirectory)) {
          pane.destroyItem(editor);
        }
      }
    });
  });

  // collapse MetaEdOutputDirectory in tree-view if exists
  // (workaround for Atom GitHub issue #3365)
  await collapseTreeViewDirectory(artifactDirectory);

  if (!artifactDirectory.includes('MetaEdOutput')) {
    outputWindow.addMessage(
      `Unable to delete output directory at path "${artifactDirectory}".  Output directory name must contain 'MetaEdOutput'.`,
    );
    return false;
  }

  try {
    if (await fs.exists(artifactDirectory)) {
      const metaEdFilePaths: string[] = klawSync(artifactDirectory, {
        filter: item => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      });
      if (metaEdFilePaths.length > 0) {
        outputWindow.addMessage(
          `Unable to delete output directory at path "${artifactDirectory}".  MetaEd files found in this location.`,
        );
        return false;
      }
    }
    // remove MetaEdOutput directory
    await fs.remove(artifactDirectory);
    return true;
  } catch (exception) {
    console.error(exception);
    outputWindow.addMessage(`Unable to peform operation on output directory at path "${artifactDirectory}".`);
    outputWindow.addMessage(exception.message);
    if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
      outputWindow.addMessage('Please close any files or folders that may be open in other applications.');
    }
    return false;
  }
}

async function verifyBuildPaths(outputWindow: OutputWindow): Promise<BuildPaths | null> {
  // cmdExePath is for Windows
  const cmdExePath = getCmdFullPath();
  if (!(await fs.exists(cmdExePath)) && os.platform() === 'win32') {
    outputWindow.addMessage(`Unable to find cmd.exe at configured path "${cmdExePath}".`);
    outputWindow.addMessage(
      'Please configure "Full Path to Cmd.exe" under the atom-metaed package to target the command prompt for Windows (Usually found at C:\\Windows\\System32\\cmd.exe).',
    );
    return null;
  }

  const metaEdConsoleDirectory = path.normalize(`${getMetaEdJsConsoleSourceDirectory()}/`); // handle missing slash for drive letter by always ensuring one
  if (!(await fs.exists(path.join(metaEdConsoleDirectory, 'package.json')))) {
    outputWindow.addMessage(
      `Unable to find package.json file in metaed-console at configured path "${metaEdConsoleDirectory}".`,
    );
    outputWindow.addMessage(
      'Please configure MetaEd Console Source Directory under the atom-metaed package to target the metaed-console root directory.',
    );
    return null;
  }

  let metaEdConsolePath = path.resolve(metaEdConsoleDirectory, '../metaed-console/dist/index.js');
  if (!(await fs.exists(metaEdConsolePath))) {
    metaEdConsolePath = path.resolve(__dirname, '../node_modules/metaed-console/dist/index.js');
    if (!(await fs.exists(metaEdConsolePath))) {
      outputWindow.addMessage(metaEdConsolePath);
      outputWindow.addMessage(
        `Unable to find the index.js executable for metaed-console in the Core MetaEd Source Directory at configured path "${metaEdConsoleDirectory}" or its parent.`,
      );
      return null;
    }
  }

  let metaEdDeployPath = path.resolve(metaEdConsoleDirectory, '../metaed-odsapi-deploy/dist/index.js');
  if (!(await fs.exists(metaEdDeployPath))) {
    metaEdDeployPath = path.resolve(__dirname, '../node_modules/metaed-odsapi-deploy/dist/index.js');
    if (!(await fs.exists(metaEdDeployPath))) {
      outputWindow.addMessage(metaEdDeployPath);
      outputWindow.addMessage(
        `Unable to find the index.js executable for metaed-odsapi-deploy in the Core MetaEd Source Directory at configured path "${metaEdDeployPath}" or its parent.`,
      );
      return null;
    }
  }

  return {
    metaEdConsoleDirectory,
    cmdExePath,
    metaEdConsolePath,
    metaEdDeployPath,
  };
}

async function executeBuild(
  { cmdExePath, metaEdConsolePath, metaEdConsoleDirectory },
  metaEdConfigurationPath,
  outputWindow: OutputWindow,
): Promise<any> {
  return new Promise(resolve => {
    const startNotification = new Notification('info', 'Building MetaEd...', { dismissable: true });
    const failNotification = new Notification('error', 'MetaEd Build Failed!', { dismissable: true });
    const buildErrorsNotification = new Notification('warning', 'MetaEd Build Errors Detected!', { dismissable: true });
    let resultNotification = new Notification('success', 'MetaEd Build Complete!', { dismissable: true });

    startNotification.onDidDisplay(() => setTimeout(() => startNotification.dismiss(), 10000));

    [resultNotification, failNotification, buildErrorsNotification].forEach(notification =>
      notification.onDidDisplay(() => {
        startNotification.dismiss();
        setTimeout(() => notification.dismiss(), 3000);
      }),
    );

    // @ts-ignore: TODO: addNotification() is old and should be replaced by addXXX functions
    setImmediate(() => atom.notifications.addNotification(startNotification));

    // const taskParams = ['/s', '/c', `node  --inspect-brk "${metaEdConsolePath}"`, '--config', `"${metaEdConfigurationPath}"`];
    const taskParams = ['/s', '/c', `node "${metaEdConsolePath}"`, '--config', `"${metaEdConfigurationPath}"`];

    console.log(`Executing Build '${cmdExePath}' with parameters:`, taskParams);

    const childProcess = spawn(cmdExePath, taskParams, {
      cwd: metaEdConsoleDirectory,
      shell: true,
    });

    const outputSplitter: any = childProcess.stdout.pipe(streamSplitter('\n'));
    outputSplitter.encoding = 'utf8';
    outputSplitter.on('token', token => {
      outputWindow.addMessage(ansihtml(token), true);
    });

    childProcess.stderr.on('data', data => {
      outputWindow.addMessage(ansihtml(data.toString()).replace(/(?:\r\n|\r|\n)/g, '<br />'), true);
      resultNotification = buildErrorsNotification;
    });

    childProcess.on('close', code => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        outputWindow.addMessage(`MetaEd build complete.`);
      } else {
        outputWindow.addMessage(`Error on MetaEd build.`);
        resultNotification = failNotification;
      }
      // @ts-ignore: TODO: addNotification() is old and should be replaced by addXXX functions
      atom.notifications.addNotification(resultNotification);
      return resolve(code === 0);
    });
  });
}

function validProjectMetadata(metaEdProjectMetadata: MetaEdProjectMetadata[], outputWindow: OutputWindow): boolean {
  let hasInvalidProject = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const pm of metaEdProjectMetadata) {
    if (pm.invalidProject) {
      outputWindow.addMessage(`Project file ${pm.invalidProjectReason}.`);
      hasInvalidProject = true;
    }
  }
  if (hasInvalidProject) return false;

  const hasExtensionProjects: boolean = R.any((pm: MetaEdProjectMetadata) => pm.isExtensionProject, metaEdProjectMetadata);
  const coreProjectMetadata: MetaEdProjectMetadata[] = metaEdProjectMetadata.filter(
    (pm: MetaEdProjectMetadata) => !pm.isExtensionProject,
  );

  // if (coreProjectMetadata.length > 1) {
  //   outputWindow.addMessage('MetaEd does not support multiple core MetaEd projects.');
  //   return false;
  // }

  // Note - we are intentionally not validating that there are multiple extension projects with the same namespace

  if (coreProjectMetadata.length < 1) {
    outputWindow.addMessage('Please set up a core MetaEd directory under MetaEd -> Settings...');
    return false;
  }

  if (coreProjectMetadata[0].projectVersion !== getTargetDsVersionSemver()) {
    outputWindow.addMessage(
      'Core MetaEd project version does not match Data Standard version selected under MetaEd -> Settings...',
    );
    return false;
  }

  if (!hasExtensionProjects && !allianceMode()) {
    outputWindow.addMessage('No extension project.  Please add an extension project folder.');
    return false;
  }

  if (semver.satisfies(getTargetOdsApiVersionSemver(), '2.x')) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pm of metaEdProjectMetadata) {
      if (pm.isExtensionProject && pm.projectNamespace !== 'Extension') {
        outputWindow.addMessage(
          `Namespace derived from projectName (first character capitalized, remove special characters) is not "Extension". ODS/API version 2.x only supports the namespace "Extension".`,
        );
        return false;
      }
    }
  }

  return true;
}

// initialConfiguration is temporary until full multi-project support
export async function build(outputWindow: OutputWindow): Promise<boolean> {
  try {
    outputWindow.clear();
    outputWindow.addMessage(`Beginning MetaEd build.`);

    const buildPaths: BuildPaths | null = await verifyBuildPaths(outputWindow);
    if (!buildPaths) return false;

    const metaEdProjectMetadata: MetaEdProjectMetadata[] = await findMetaEdProjectMetadata(true);
    if (!validProjectMetadata(metaEdProjectMetadata, outputWindow)) return false;

    const initialConfiguration = metaEdConfigurationFor(getTargetOdsApiVersionSemver(), allianceMode());
    // last project is where output goes
    const lastProject: MetaEdProjectMetadata = R.last(metaEdProjectMetadata);
    const artifactDirectory: string = path.join(lastProject.projectPath, 'MetaEdOutput');

    const metaEdConfiguration: MetaEdConfiguration = {
      ...initialConfiguration,
      artifactDirectory,
    };

    metaEdProjectMetadata.forEach(pm => {
      metaEdConfiguration.projects.push({
        namespaceName: pm.projectNamespace,
        projectName: pm.projectName,
        projectVersion: pm.projectVersion,
        projectExtension: pm.projectExtension,
        description: pm.projectDescription,
      });
      metaEdConfiguration.projectPaths.push(pm.projectPath);
    });

    console.log('build() using config: ', metaEdConfiguration);

    if (!(await cleanUpMetaEdArtifacts(artifactDirectory, outputWindow))) return false;

    tmp.setGracefulCleanup();
    const tempConfigurationPath = await tmp.tmpName({ prefix: 'MetaEdConfig-', postfix: '.json' });
    await fs.outputJson(tempConfigurationPath, { metaEdConfiguration }, { spaces: 2 });

    const buildResult = await executeBuild(buildPaths, tempConfigurationPath, outputWindow);

    await fs.remove(tempConfigurationPath);
    return buildResult;
  } catch (e) {
    outputWindow.addMessage(e);
    return false;
  }
}

async function executeDeploy(
  { cmdExePath, metaEdDeployPath, metaEdConsoleDirectory },
  metaEdConfigurationPath,
  outputWindow: OutputWindow,
  shouldDeployCore: boolean = false,
): Promise<any> {
  return new Promise(resolve => {
    const startNotification = new Notification('info', 'Deploying MetaEd...', { dismissable: true });
    const failNotification = new Notification('error', 'MetaEd Deploy Failed!', { dismissable: true });
    const buildErrorsNotification = new Notification('warning', 'MetaEd Deploy Errors Detected!', { dismissable: true });
    let resultNotification = new Notification('success', 'MetaEd Deploy Complete!', { dismissable: true });

    startNotification.onDidDisplay(() => setTimeout(() => startNotification.dismiss(), 10000));

    [resultNotification, failNotification, buildErrorsNotification].forEach(notification =>
      notification.onDidDisplay(() => {
        startNotification.dismiss();
        setTimeout(() => notification.dismiss(), 3000);
      }),
    );

    // @ts-ignore: TODO: addNotification() is old and should be replaced by addXXX functions
    setImmediate(() => atom.notifications.addNotification(startNotification));

    // const taskParams = ['/s', '/c', `node --inspect-brk "${metaEdDeployPath}"`, '--config', `"${metaEdConfigurationPath}"`];
    const taskParams = ['/s', '/c', `node "${metaEdDeployPath}"`, '--config', `"${metaEdConfigurationPath}"`];

    if (shouldDeployCore) taskParams.push('--core');
    if (suppressDeleteOnDeploy()) taskParams.push('--suppressDelete');

    console.log(`Executing Deploy '${cmdExePath}' with parameters:`, taskParams);

    const childProcess = spawn(cmdExePath, taskParams, {
      cwd: metaEdConsoleDirectory,
      shell: true,
    });

    const outputSplitter: any = childProcess.stdout.pipe(streamSplitter('\n'));
    outputSplitter.encoding = 'utf8';
    outputSplitter.on('token', token => {
      outputWindow.addMessage(ansihtml(token), true);
    });

    childProcess.stderr.on('data', data => {
      outputWindow.addMessage(ansihtml(data.toString()).replace(/(?:\r\n|\r|\n)/g, '<br />'), true);
      resultNotification = buildErrorsNotification;
    });

    childProcess.on('close', code => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        outputWindow.addMessage(`MetaEd Deploy complete.`);
      } else {
        outputWindow.addMessage(`Error on MetaEd Deploy.`);
        resultNotification = failNotification;
      }
      // @ts-ignore: TODO: addNotification() is old and should be replaced by addXXX functions
      atom.notifications.addNotification(resultNotification);
      return resolve(code === 0);
    });
  });
}

export async function deploy(outputWindow: OutputWindow, shouldDeployCore: boolean = false): Promise<boolean> {
  try {
    outputWindow.addMessage(`Beginning MetaEd Deploy.`);

    const buildPaths: BuildPaths | null = await verifyBuildPaths(outputWindow);
    if (!buildPaths) return false;

    const metaEdProjectMetadata: MetaEdProjectMetadata[] = await findMetaEdProjectMetadata(true);
    if (!validProjectMetadata(metaEdProjectMetadata, outputWindow)) return false;

    const initialConfiguration = metaEdConfigurationFor(getTargetOdsApiVersionSemver(), allianceMode());
    // last project is where output goes
    const lastProject: MetaEdProjectMetadata = R.last(metaEdProjectMetadata);
    const artifactDirectory: string = path.join(lastProject.projectPath, 'MetaEdOutput');

    const metaEdConfiguration: MetaEdConfiguration = {
      ...initialConfiguration,
      artifactDirectory,
    };

    metaEdProjectMetadata.forEach(pm => {
      metaEdConfiguration.projects.push({
        namespaceName: pm.projectNamespace,
        projectName: pm.projectName,
        projectVersion: pm.projectVersion,
        projectExtension: pm.projectExtension,
        description: pm.projectDescription,
      });
      metaEdConfiguration.projectPaths.push(pm.projectPath);
    });

    metaEdConfiguration.deployDirectory = path.normalize(`${getEdfiOdsApiSourceDirectory()}/`); // handle missing slash for drive letter by always ensuring one

    console.log('deploy() using config: ', metaEdConfiguration);

    tmp.setGracefulCleanup();
    const tempConfigurationPath = await tmp.tmpName({ prefix: 'MetaEdConfig-', postfix: '.json' });
    await fs.outputJson(tempConfigurationPath, { metaEdConfiguration }, { spaces: 2 });

    const deployResult = await executeDeploy(buildPaths, tempConfigurationPath, outputWindow, shouldDeployCore);

    await fs.remove(tempConfigurationPath);
    return deployResult;
  } catch (e) {
    outputWindow.addMessage(e.stack);
    return false;
  }
}
