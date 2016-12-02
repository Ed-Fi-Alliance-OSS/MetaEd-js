// @flow
import { List, Map, Record } from 'immutable';
import SymbolTable from './validators/SymbolTable';
import type { ValidationMessage } from './validators/ValidationMessage';
import type { FilesToLoad, InputDirectory } from './tasks/FileSystemFilenameLoader';
import type { FileIndex } from './tasks/FileIndex';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';

type StateRecord = {
  action: List<string>,
  warningMessageCollection: List<ValidationMessage>,
  errorMessageCollection: List<ValidationMessage>,
  symbolTable: ?SymbolTable,
  fileIndex: FileIndex,
  filesToLoad: ?FilesToLoad[],
  inputDirectories: ?InputDirectory[],
  parseTree: ?MetaEdGrammar,
  validatorData: Map<string, string>,
};

export type State = Record<StateRecord>;

// eslint-disable-next-line import/prefer-default-export
export const StateInstance: State = Record({
  action: new List(),
  warningMessageCollection: new List(),
  errorMessageCollection: new List(),
  symbolTable: null,
  fileIndex: null,
  filesToLoad: null,
  inputDirectories: null,
  parseTree: null,
  validatorData: new Map(),
});
