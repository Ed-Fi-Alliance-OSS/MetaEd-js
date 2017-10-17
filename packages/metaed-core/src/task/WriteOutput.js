// @flow
import R from 'ramda';
import ffs from 'final-fs';
import path from 'path';
import winston from 'winston';
import type { State } from '../State';

winston.cli();

export function execute(state: State): State {
  const outputDirectory = state.outputDirectory
    ? state.outputDirectory
    : path.resolve(R.last(state.inputDirectories).path, './MetaEdOutput');

  if (!ffs.exists(outputDirectory)) {
    winston.info('No output directory specified. Not writing files.');
    return state;
  }
  winston.info(`Output directory: ${outputDirectory}`);
  ffs.rmdirRecursiveSync(outputDirectory);
  ffs.mkdirRecursiveSync(outputDirectory);
  if (ffs.existsSync(outputDirectory)) {
    state.generatorResults.forEach(result => {
      result.generatedOutput.forEach(output => {
        if (!ffs.existsSync(`${outputDirectory}/${output.folderName}`)) ffs.mkdirRecursiveSync(`${outputDirectory}/${output.folderName}`);
        ffs.writeFileSync(`${outputDirectory}/${output.folderName}/${output.fileName}`, output.resultString, 'utf-8');
      });
    });
  }
  return state;
}
