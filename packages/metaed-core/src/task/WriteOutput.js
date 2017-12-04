// @flow
import ffs from 'final-fs';
import path from 'path';
import winston from 'winston';
import type { State } from '../State';

winston.cli();

export function execute(state: State): void {
  let outputDirectory: string = '';
  if (state.outputDirectory) {
    outputDirectory = state.outputDirectory;
  } else if (state.inputDirectories && state.inputDirectories.length > 0) {
    const [defaultRootDirectory] = state.inputDirectories.slice(-1);
    outputDirectory = path.resolve(defaultRootDirectory.path, './MetaEdOutput');
  }

  if (!ffs.exists(outputDirectory)) {
    winston.error(`WriteOutput: Output directory '${outputDirectory}' does not exist. Not writing files.`);
    return;
  }
  winston.info(`Output directory: ${outputDirectory}`);
  ffs.rmdirRecursiveSync(outputDirectory);
  ffs.mkdirRecursiveSync(outputDirectory);
  if (ffs.existsSync(outputDirectory)) {
    state.generatorResults.forEach(result => {
      result.generatedOutput.forEach(output => {
        if (!ffs.existsSync(`${outputDirectory}/${output.folderName}`)) ffs.mkdirRecursiveSync(`${outputDirectory}/${output.folderName}`);
        if (output.resultString) ffs.writeFileSync(`${outputDirectory}/${output.folderName}/${output.fileName}`, output.resultString, 'utf-8');
        else if (output.resultStream) ffs.writeFileSync(`${outputDirectory}/${output.folderName}/${output.fileName}`, output.resultStream);
      });
    });
  }
}
