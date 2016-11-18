// @flow
import { List } from 'immutable';
import SymbolTable from './validators/SymbolTable';
import MetaEdFileIndex from './tasks/SingleFileMetaEdFileIndex';
import type { ValidationMessage } from './validators/ValidationMessage';
import type { FilesToLoad, InputDirectory } from './tasks/FileSystemFilenameLoader';

export type State = {
  warningMessageCollection: List<ValidationMessage>,
  errorMessageCollection: List<ValidationMessage>,
  symbolTable: SymbolTable,
  metaEdFileIndex: MetaEdFileIndex,
  filesToLoad?: FilesToLoad[],
  inputDirectories?: InputDirectory[],
}
