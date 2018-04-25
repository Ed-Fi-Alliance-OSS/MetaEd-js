/** @babel */
// @flow

// eslint-disable-next-line
import { Notification } from 'atom';
import R from 'ramda';
import fs from 'fs-extra';
import tmp from 'tmp-promise';
import path from 'path';
import { spawn as nodeSpawn } from 'child_process';
import streamSplitter from 'stream-splitter';
import ansihtml from 'ansi-html';
import {
  getMetaEdConsoleSourceDirectory,
  getCmdFullPath,
  getTargetDsVersionSemver,
  getTargetOdsApiVersionSemver,
} from './PackageSettings';
import type OutputWindow from './OutputWindow';
import type { MetaEdProjectMetadata } from './Projects';
import { findMetaEdProjectMetadata } from './Projects';

type GulpInputs = {
  taskName: string,
  projectPath: string,
  metaEdConsoleSourceDirectory: string,
  cmdFullPath: string,
  gulpFilePath: string,
  artifactPath: string,
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

  async build(): Promise<boolean> {
    const taskName = 'generate-artifacts';
    const gulpInputs = await this._verifyGulpInputs(taskName);
    if (!gulpInputs) {
      return new Promise(resolve => resolve(false));
    }
    this._metaEdLog.addMessage(`Continuing with execution of MetaEd C# task ${taskName}...`);

    return this._executeGulpTask(gulpInputs);
  }

  // only supports C# generation against core - we dropped extensions due to lack of multi-extension support and lack of documentation need
  async _verifyGulpInputs(taskName: string): Promise<?GulpInputs> {
    const metaEdConsoleSourceDirectory = getMetaEdConsoleSourceDirectory();
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
    if (!fs.existsSync(cmdFullPath)) {
      this._metaEdLog.addMessage(`Unable to find cmd.exe at configured path "${cmdFullPath}".`);
      this._metaEdLog.addMessage(
        'Please configure "Full Path to Cmd.exe" under the atom-metaed package to target the command prompt for Windows (Usually found at C:\\Windows\\System32\\cmd.exe).',
      );
      return null;
    }

    const metaEdProjectMetadata: Array<MetaEdProjectMetadata> = await findMetaEdProjectMetadata();
    const coreProjectMetadata: MetaEdProjectMetadata = R.find(
      (pm: MetaEdProjectMetadata) => !pm.isExtensionProject,
      metaEdProjectMetadata,
    );

    // last project is where output goes
    const lastProject: MetaEdProjectMetadata = R.last(metaEdProjectMetadata);
    const artifactPath: string = path.join(lastProject.projectPath, 'MetaEdOutput');
    const projectPath = coreProjectMetadata.projectPath;

    let gulpPath = path.resolve(metaEdConsoleSourceDirectory, '../.bin/gulp.cmd');
    if (!fs.existsSync(gulpPath)) {
      gulpPath = path.resolve(metaEdConsoleSourceDirectory, 'node_modules/.bin/gulp.cmd');
      if (!fs.existsSync(gulpPath)) {
        this._metaEdLog.addMessage(
          `Unable to find the gulp.cmd executable in the Core MetaEd Source Directory at configured path "${metaEdConsoleSourceDirectory}" or its parent.`,
        );
        return null;
      }
    }

    return {
      taskName,
      projectPath,
      metaEdConsoleSourceDirectory,
      cmdFullPath,
      gulpFilePath,
      artifactPath,
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
    params.push('--metaEdPath');
    params.push(gulpInputs.projectPath);
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
            path.join(tempArtifactDirectoryObject.path, 'InterchangeBrief'),
            path.join(realArtifactDirectory, 'Documentation', 'InterchangeBrief'),
          );
          await fs.copy(
            path.join(tempArtifactDirectoryObject.path, 'UDM'),
            path.join(realArtifactDirectory, 'Documentation', 'UDM'),
          );

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
