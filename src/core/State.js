// @flow
import { List } from 'immutable';
import SymbolTable from './validators/SymbolTable';
import type { ValidationMessage } from './validators/ValidationMessage';
import type { FilesToLoad, InputDirectory } from './tasks/FileSystemFilenameLoader';
import { IMetaEdFileIndex } from './tasks/IMetaEdFileIndex';

export type State = {
  warningMessageCollection: List<ValidationMessage>,
  errorMessageCollection: List<ValidationMessage>,
  symbolTable: SymbolTable,
  metaEdFileIndex: IMetaEdFileIndex,
  filesToLoad?: FilesToLoad[],
  inputDirectories?: InputDirectory[],
}
