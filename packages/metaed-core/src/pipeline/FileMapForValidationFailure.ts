import chalk from 'chalk';
import { getFilenameAndLineNumber } from '../file/FileIndex';
import { State } from '../State';
import { ValidationFailure } from '../validator/ValidationFailure';
import { Logger } from '../Logger';

function logValidationFailures(state: State): void {
  state.validationFailure.forEach((validationFailure: ValidationFailure) => {
    const fullPath = validationFailure.fileMap ? validationFailure.fileMap.fullPath : '';
    const adjustedLine: number =
      !validationFailure.fileMap || validationFailure.fileMap.lineNumber === 0 ? 1 : validationFailure.fileMap.lineNumber;
    const characterPosition: number = validationFailure.sourceMap ? validationFailure.sourceMap.column + 1 : 1;
    const logMessage = `  ${validationFailure.message}  ${chalk.gray(`${fullPath} (${adjustedLine}:${characterPosition})`)}`;

    if (validationFailure.category === 'error') {
      Logger.error(logMessage);
    } else if (validationFailure.category === 'warning') {
      Logger.warn(logMessage);
    } else {
      Logger.info(logMessage);
    }
  });
}

export function fileMapForValidationFailure(state: State): void {
  if (state.validationFailure.length === 0) return;

  state.validationFailure.forEach((failure) => {
    if (!failure.fileMap && failure.sourceMap && state.fileIndex) {
      failure.fileMap = getFilenameAndLineNumber(state.fileIndex, failure.sourceMap.line);
    }
  });

  logValidationFailures(state);
}
