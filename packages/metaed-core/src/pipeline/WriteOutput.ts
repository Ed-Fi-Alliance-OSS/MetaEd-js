// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'node:fs';
import klawSync from 'klaw-sync';
import path from 'path';
import { State } from '../State';
import { GeneratorResult } from '../generator/GeneratorResult';
import { Logger } from '../Logger';

export const METAED_OUTPUT = 'MetaEdOutput';
const LINUX_USER_FULL_CONTROL = 0o700;

function writeOutputFiles(result: GeneratorResult, outputDirectory: string) {
  result.generatedOutput.forEach((output) => {
    const folderName: string =
      output.namespace != null && output.namespace !== '' ? `${output.namespace}/${output.folderName}` : output.folderName;
    if (!fs.existsSync(`${outputDirectory}/${folderName}`))
      fs.mkdirSync(`${outputDirectory}/${folderName}`, { mode: LINUX_USER_FULL_CONTROL, recursive: true });
    if (output.resultString)
      fs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultString, 'utf-8');
    else if (output.resultStream)
      fs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultStream);
    else Logger.debug(`No output stream or string for ${result.generatorName}`);
  });
}

export function execute(state: State): boolean {
  let outputDirectory = '';
  const [defaultRootDirectory] = state.inputDirectories.slice(-1);
  if (state.outputDirectory) {
    // TODO: not used?
    outputDirectory = path.resolve(state.outputDirectory, METAED_OUTPUT);
  } else if (state.metaEdConfiguration.artifactDirectory) {
    outputDirectory = path.resolve(defaultRootDirectory.path, state.metaEdConfiguration.artifactDirectory);
  } else if (state.inputDirectories && state.inputDirectories.length > 0) {
    outputDirectory = path.resolve(defaultRootDirectory.path, METAED_OUTPUT);
  }

  Logger.info(`- Artifact Directory: ${outputDirectory}`);

  try {
    if (fs.existsSync(outputDirectory)) {
      if (!outputDirectory.includes(METAED_OUTPUT)) {
        Logger.error(
          `Unable to delete output directory at path "${outputDirectory}".  Output directory name must contain 'MetaEdOutput'.`,
        );
        return false;
      }

      const testForMetaEdFilePaths = klawSync(outputDirectory, {
        filter: (item) => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      });
      if (testForMetaEdFilePaths.length > 0) {
        Logger.error(`WriteOutput: MetaEd files found in output location '${outputDirectory}'. Not writing files.`);
        return false;
      }
      fs.rmSync(outputDirectory, { recursive: true, force: true }); // Updated per Node.js deprecation warning
    }

    fs.mkdirSync(outputDirectory, { mode: LINUX_USER_FULL_CONTROL, recursive: true });

    // TODO: change this to use async/await
    state.generatorResults.forEach((result) => {
      // if (result is a Promise)
      if ((result as any).then) {
        Logger.debug('Resolving Promise:');
        (result as any).then((resolvedResult) => {
          writeOutputFiles(resolvedResult, outputDirectory);
        });
      } else writeOutputFiles(result, outputDirectory);
    });

    state.metaEdConfiguration.artifactDirectory = outputDirectory;
    return true;
  } catch (exception) {
    Logger.error(`WriteOutput: Unable to write files to output location '${outputDirectory}'.`, exception);
    if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
      Logger.error('Please close any files or folders that may be open in other applications.');
    }
    return false;
  }
}
