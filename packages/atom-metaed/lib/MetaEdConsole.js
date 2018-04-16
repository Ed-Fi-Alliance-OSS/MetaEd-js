/** @babel */
// @flow

// eslint-disable-next-line
import { Notification } from 'atom';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import path from 'path';
import { spawn as nodeSpawn } from 'child_process';
import streamSplitter from 'stream-splitter';
import ansihtml from 'ansi-html';
import {
  getMetaEdConsoleSourceDirectory,
  getCoreMetaEdSourceDirectory,
  getCmdFullPath,
  getEdfiOdsApiSourceDirectory,
  allianceMode,
  getTargetDsVersion,
  getTargetDsVersionSemver,
  getTargetOdsApiVersionSemver,
} from './PackageSettings';
import type { MetaEdProject } from './ProjectSettings';
import type OutputWindow from './OutputWindow';
import { projectValuesFromProjectJson, lowercaseAndNumericOnly } from './MetaEdConsoleJs';

type GulpInputs = {
  taskName: string,
  isExtensionProject: boolean,
  extensionNamespace: string,
  projectPath: string,
  metaEdConsoleSourceDirectory: string,
  coreMetaEdSourceDirectory: string,
  cmdFullPath: string,
  gulpFilePath: string,
  artifactPath: string,
  edfiOdsApiSourceDirectory: ?string,
  edfiOdsRepoDirectory: ?string,
  edfiOdsImplementationRepoDirectory: ?string,
  gulpPath: string,
};

export default class MetaEdConsole {
  // this is to allow mocking of spawn in tests
  _spawn: nodeSpawn;
  _metaEdLog: OutputWindow;

  constructor(outputWindow: OutputWindow) {
    this._spawn = nodeSpawn;
    this._metaEdLog = outputWindow;
  }

  async build(isExtensionProject: boolean = false): Promise<boolean> {
    return this._gulpTask('generate-artifacts', isExtensionProject);
  }

  deploy(isExtensionProject: boolean = false) {
    const result = atom.confirm({
      message: 'Are you sure you want to deploy MetaEd artifacts?',
      detailedMessage:
        'This will overwrite core and extension files in the Ed-Fi ODS / API with MetaEd generated versions.  You will need to run initdev afterwards to reinitialize the Ed-Fi ODS / API.',
      buttons: ['OK', 'Cancel'],
    });

    if (result !== 0) {
      return;
    }
    if (isExtensionProject) {
      this._gulpTask('deploy-extensions-only', isExtensionProject);
    } else {
      this._gulpTask('deploy', isExtensionProject);
    }
  }

  async _gulpTask(taskName: string, isExtensionProject: boolean = false): Promise<boolean> {
    const gulpInputs = await this._verifyGulpInputs(taskName, isExtensionProject);
    if (!gulpInputs) {
      return new Promise(resolve => resolve(false));
    }
    this._metaEdLog.addMessage(`Continuing with execution of MetaEd C# task ${taskName}...`);

    return this._executeGulpTask(gulpInputs);
  }

  // TODO: support multiple extension projects??? This is C#
  async _verifyGulpInputs(taskName: string, isExtensionProject: boolean = false): Promise<?GulpInputs> {
    let projectPath = atom.project.getPaths()[1];
    if (!projectPath && !allianceMode()) {
      this._metaEdLog.addMessage('No Extension Project found in editor.  Please add an extension project folder.');
      return null;
    }

    if (!projectPath && allianceMode()) {
      if (atom.project.getPaths().length < 1) {
        this._metaEdLog.addMessage(
          'Please set up a core MetaEd directory under File -> Settings -> Packages -> atom-metaed.',
        );
        return null;
      }
      projectPath = atom.project.getPaths()[0];
    }

    const metaEdConsoleSourceDirectory = getMetaEdConsoleSourceDirectory();
    const coreMetaEdSourceDirectory = getCoreMetaEdSourceDirectory();
    const cmdFullPath = getCmdFullPath();
    const gulpFilePath = path.join(metaEdConsoleSourceDirectory, 'gulpfile.js');
    if (!fs.existsSync(gulpFilePath)) {
      this._metaEdLog.addMessage(
        `Unable to find gulpfile.js file in MetaEd Console Source Directory at configured path "${metaEdConsoleSourceDirectory}".`,
      );
      this._metaEdLog.addMessage(
        'Please configure MetaEd Console Source Directory under the atom-metaed package to target the prebuilt MetaEd Console root directory.',
      );
      return null;
    }
    if (!fs.existsSync(coreMetaEdSourceDirectory)) {
      this._metaEdLog.addMessage(
        `Unable to find Core MetaEd Source Directory at configured path "${coreMetaEdSourceDirectory}".`,
      );
      this._metaEdLog.addMessage(
        'Please configure Core MetaEd Source Directory under the atom-metaed package to target a core Ed-Fi Model root directory.',
      );
      return null;
    }
    if (!fs.existsSync(cmdFullPath)) {
      this._metaEdLog.addMessage(`Unable to find cmd.exe at configured path "${cmdFullPath}".`);
      this._metaEdLog.addMessage(
        'Please configure "Full Path to Cmd.exe" under the atom-metaed package to target the command prompt for Windows (Usually found at C:\\Windows\\System32\\cmd.exe).',
      );
      return null;
    }
    const artifactPath = path.join(projectPath, 'MetaEdOutput/');

    let gulpPath = path.resolve(metaEdConsoleSourceDirectory, '../.bin/gulp.cmd');
    if (!fs.existsSync(gulpPath)) {
      gulpPath = path.resolve(metaEdConsoleSourceDirectory, 'node_modules/.bin/gulp.cmd');
      if (!fs.existsSync(gulpPath)) {
        this._metaEdLog.addMessage(
          `Unable to find the gulp.cmd executable in the Core MetaEd Source Directory at configured path "${coreMetaEdSourceDirectory}" or its parent.`,
        );
        return null;
      }
    }

    let edfiOdsApiSourceDirectory;
    let edfiOdsRepoDirectory;
    let edfiOdsImplementationRepoDirectory;
    if (taskName.startsWith('deploy')) {
      edfiOdsApiSourceDirectory = getEdfiOdsApiSourceDirectory();
      edfiOdsRepoDirectory = path.join(edfiOdsApiSourceDirectory, 'Ed-Fi-ODS/');
      edfiOdsImplementationRepoDirectory = path.join(edfiOdsApiSourceDirectory, 'Ed-Fi-ODS-Implementation/');
      if (!fs.existsSync(edfiOdsRepoDirectory) || !fs.existsSync(edfiOdsImplementationRepoDirectory)) {
        this._metaEdLog.addMessage(
          `Unable to find Ed-Fi-ODS and Ed-Fi-ODS-Implementation folders at configured path "${edfiOdsApiSourceDirectory}".`,
        );
        this._metaEdLog.addMessage(
          'Please configure Ed-Fi ODS Api Source Directory under the atom-metaed package to target the local copy of the Ed-Fi-ODS Api source code.  The targeted folder should contain the repositories for Ed-Fi-ODS and Ed-Fi-ODS-Implementation.',
        );
        return null;
      }
    }

    let extensionNamespace = 'extension';
    if (isExtensionProject) {
      const configFile = atom.project.getDirectories()[1].getFile('package.json');
      if (configFile.existsSync()) {
        try {
          const metaEdProject: ?MetaEdProject = await projectValuesFromProjectJson(configFile.getRealPathSync());
          if (metaEdProject != null) {
            const namespace = lowercaseAndNumericOnly(metaEdProject.projectName);
            extensionNamespace = namespace != null ? namespace : extensionNamespace;
          }
        } catch (error) {
          // Use default if file doesn't match expected format
        }
      }
    }

    return {
      taskName,
      isExtensionProject,
      projectPath,
      metaEdConsoleSourceDirectory,
      coreMetaEdSourceDirectory,
      cmdFullPath,
      gulpFilePath,
      artifactPath,
      edfiOdsApiSourceDirectory,
      edfiOdsRepoDirectory,
      edfiOdsImplementationRepoDirectory,
      extensionNamespace,
      gulpPath,
    };
  }

  _createGulpTaskParams(gulpInputs: GulpInputs) {
    const params = [
      '/s',
      '/c',
      `${gulpInputs.gulpPath} ${gulpInputs.taskName} --color`,
      '--artifactPath',
      gulpInputs.artifactPath,
      '--deployTargetVersion',
      getTargetOdsApiVersionSemver(),
      '--version',
      getTargetDsVersionSemver(),
      // tell C# to only to generate non-JS items
      '--artifactGeneration',
      'Non_JS',
    ];
    if (gulpInputs.isExtensionProject) {
      params.push('--metaEdPath');
      params.push(gulpInputs.coreMetaEdSourceDirectory);
      params.push('--extensionMetaEdPath');
      params.push(gulpInputs.projectPath);
      params.push('--extensionNamespace');
      params.push(gulpInputs.extensionNamespace);
      params.push('--includeExtensions');
    } else {
      params.push('--metaEdPath');
      params.push(gulpInputs.projectPath);
    }
    if (gulpInputs.taskName.startsWith('deploy')) {
      params.push('--odsApiRootPath');
      params.push(gulpInputs.edfiOdsRepoDirectory);
      params.push('--odsApiImplementationRootPath');
      params.push(gulpInputs.edfiOdsImplementationRepoDirectory);
    }
    return params;
  }

  async _executeGulpTask(gulpInputs: GulpInputs): Promise<boolean> {
    return new Promise(async resolve => {
      const startNotification = new Notification('info', 'Building MetaEd C#...', { dismissable: true });
      const failNotification = new Notification('error', 'MetaEd C# Build Failed!', { dismissable: true });
      const buildErrorsNotification = new Notification('warning', 'MetaEd C# Build Errors Detected!', { dismissable: true });
      let resultNotification = new Notification('success', 'MetaEd C# Build Complete!', { dismissable: true });

      startNotification.onDidDisplay(() => setTimeout(() => startNotification.dismiss(), 10000));

      [resultNotification, failNotification, buildErrorsNotification].forEach(notification =>
        notification.onDidDisplay(() => {
          startNotification.dismiss();
          setTimeout(() => notification.dismiss(), 3000);
        }),
      );

      setImmediate(() => atom.notifications.addNotification(startNotification));

      // Set up for temp output directory
      const realArtifactDirectory: string = gulpInputs.artifactPath;
      tmp.setGracefulCleanup();
      const tempArtifactDirectoryObject = await tmp.dir({ prefix: 'MetaEdOutput-' });
      // eslint-disable-next-line
      gulpInputs.artifactPath = tempArtifactDirectoryObject.path;

      const gulpTaskParams = this._createGulpTaskParams(gulpInputs);
      if (!gulpTaskParams) {
        return;
      }

      console.log('Executing MetaEd C# with parameters:', gulpTaskParams);

      const childProcess = this._spawn(gulpInputs.cmdFullPath, gulpTaskParams, {
        cwd: gulpInputs.metaEdConsoleSourceDirectory,
      });

      const outputSplitter = childProcess.stdout.pipe(streamSplitter('\n'));
      outputSplitter.encoding = 'utf8';
      outputSplitter.on('token', token => {
        this._metaEdLog.addMessage(ansihtml(token), true);
      });

      childProcess.stderr.on('data', data => {
        this._metaEdLog.addMessage(ansihtml(`Error: ${String(data)}`), true);
        resultNotification = buildErrorsNotification;
      });

      childProcess.on('close', async code => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
          this._metaEdLog.addMessage(`Successfully executed MetaEd C# task ${gulpInputs.taskName}.`);

          // copy from temp directory to artifact directory
          // at this point, it's only documentation files C# is generating
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'DataDictionary'),
            path.join(realArtifactDirectory, 'Documentation', 'DataDictionary'),
          );
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'Ed-Fi-Handbook'),
            path.join(realArtifactDirectory, 'Documentation', 'Ed-Fi-Handbook'),
          );
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'InterchangeBrief'),
            path.join(realArtifactDirectory, 'Documentation', 'InterchangeBrief'),
          );
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'JSON'),
            path.join(realArtifactDirectory, 'Documentation', 'JSON'),
          );
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'UDM'),
            path.join(realArtifactDirectory, 'Documentation', 'UDM'),
          );

          // HACK: Move InterchangeOrderMetadata from documentation to new output structure
          if (getTargetDsVersion() !== '3.0') {
            const interchangeOrderMetadataPath = path.join(
              tempArtifactDirectoryObject.path,
              'ApiMetadata',
              'InterchangeOrderMetadata.xml',
            );
            if (fs.existsSync(interchangeOrderMetadataPath)) {
              await fs.copy(
                interchangeOrderMetadataPath,
                path.join(realArtifactDirectory, 'edfi', 'ApiMetadata', 'InterchangeOrderMetadata.xml'),
              );
            }
            const interchangeOrderMetadataExtensionPath = path.join(
              tempArtifactDirectoryObject.path,
              'ApiMetadata',
              'InterchangeOrderMetadata-EXTENSION.xml',
            );
            if (fs.existsSync(interchangeOrderMetadataExtensionPath)) {
              await fs.copy(
                interchangeOrderMetadataExtensionPath,
                path.join(realArtifactDirectory, 'extension', 'ApiMetadata', 'InterchangeOrderMetadata-EXTENSION.xml'),
              );
            }
          }

          await fs.remove(tempArtifactDirectoryObject.path);
        } else {
          this._metaEdLog.addMessage(`Error on call to MetaEd C# task ${gulpInputs.taskName}.`);
          resultNotification = failNotification;
        }
        atom.notifications.addNotification(resultNotification);
        return resolve(code === 0);
      });
    });
  }
}
