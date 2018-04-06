// @flow
import * as Chalk from 'chalk';
import ffs from 'final-fs';
import klawSync from 'klaw-sync';
import path from 'path';
import winston from 'winston';
import type { State } from '../State';
import type { GeneratorResult } from '../generator/GeneratorResult';

winston.cli();
const chalk = new Chalk.constructor({ level: 3 });
export const METAED_OUTPUT: string = 'MetaEdOutput';

function writeOutputFiles(result: GeneratorResult, outputDirectory: string) {
  result.generatedOutput.forEach(output => {
    const folderName: string =
      output.namespace != null && output.namespace !== '' ? `${output.namespace}/${output.folderName}` : output.folderName;
    if (!ffs.existsSync(`${outputDirectory}/${folderName}`)) ffs.mkdirRecursiveSync(`${outputDirectory}/${folderName}`);
    if (output.resultString)
      ffs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultString, 'utf-8');
    else if (output.resultStream)
      ffs.writeFileSync(`${outputDirectory}/${folderName}/${output.fileName}`, output.resultStream);
    else winston.info(`No output stream or string for ${result.generatorName}`);
  });
}

export function execute(state: State): boolean {
  let outputDirectory: string = '';
  const [defaultRootDirectory] = state.inputDirectories.slice(-1);
  if (state.outputDirectory) {
    // TODO: not used?
    outputDirectory = path.resolve(state.outputDirectory, METAED_OUTPUT);
  } else if (state.metaEdConfiguration.artifactDirectory) {
    outputDirectory = path.resolve(defaultRootDirectory.path, state.metaEdConfiguration.artifactDirectory);
  } else if (state.inputDirectories && state.inputDirectories.length > 0) {
    outputDirectory = path.resolve(defaultRootDirectory.path, METAED_OUTPUT);
  }

  winston.info(chalk.green('  Artifact Directory: ') + outputDirectory);

  try {
    if (ffs.existsSync(outputDirectory)) {
      if (!outputDirectory.includes(METAED_OUTPUT)) {
        winston.error(
          `Unable to delete output directory at path "${outputDirectory}".  Output directory name must contain 'MetaEdOutput'.`,
        );
        return false;
      }

      const testForMetaEdFilePaths: Array<string> = klawSync(outputDirectory, {
        filter: item => ['.metaed', '.metaEd', '.MetaEd', '.METAED'].includes(path.extname(item.path)),
      });
      if (testForMetaEdFilePaths.length > 0) {
        winston.error(`WriteOutput: MetaEd files found in output location '${outputDirectory}'. Not writing files.`);
        return false;
      }
      ffs.rmdirRecursiveSync(outputDirectory);
    }

    ffs.mkdirRecursiveSync(outputDirectory);
    state.generatorResults.forEach(result => {
      // if (result is a Promise)
      // $FlowIgnore --- This is wrong, generatorresults should just all be promises to await on
      if (result.then) {
        winston.info('Resolving Promise:');
        // $FlowIgnore - flow was expecting a GeneratorResults not a promise
        result.then(resolvedResult => {
          writeOutputFiles(resolvedResult, outputDirectory);
        });
      } else writeOutputFiles(result, outputDirectory);
    });

    state.metaEdConfiguration.artifactDirectory = outputDirectory;
    return true;
  } catch (exception) {
    winston.error(`WriteOutput: Unable to write files to output location '${outputDirectory}'.`, exception);
    if (exception.code === 'ENOTEMPTY' || exception.code === 'EPERM') {
      winston.error('Please close any files or folders that may be open in other applications.');
    }
    return false;
  }
}
