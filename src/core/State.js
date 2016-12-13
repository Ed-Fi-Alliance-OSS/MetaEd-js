// @flow
import { List, Map, Record, Set } from 'immutable';
import SymbolTable from './validators/SymbolTable';
import type { ValidationMessage } from './validators/ValidationMessage';
import type { InputDirectory } from './tasks/FileSystemFilenameLoader';
import type { FileSet } from './tasks/MetaEdFile';
import type { FileIndex } from './tasks/FileIndex';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';

type StateRecord = {
  // every function/object that changes the state must append their name here
  action: List<string>,

  // the collection of error messages from syntax and semantic validation, and other processes
  errorMessageCollection: List<ValidationMessage>,

  // the collection of warning messages from semantic validation
  warningMessageCollection: List<ValidationMessage>,

  // the specified directories to load .metaed files from
  inputDirectories: ?InputDirectory[],

  // filepaths to exclude from loading, usually used to allow upstream tasks to provide their own versions in a FileSet
  // e.g. files that are open and unsaved in an editor
  filepathsToExclude: Set<string>,

  // the set of files whose contents have been loaded
  loadedFileSet: List<FileSet>,

  // the sourcemap for the concatenation of all .metaed files
  fileIndex: FileIndex,

  // the symbol table created by SymbolTableBuilder
  symbolTable: ?SymbolTable,

  // the ANTLR parse tree of the concatenated .metaed files
  parseTree: ?MetaEdGrammar,

  // a store for individual validators that need to maintain information between runs
  // e.g. ensuring no duplicate MetaEdIds
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
  loadedFileSet: new List(),
  inputDirectories: null,
  filepathsToExclude: new Set(),
  parseTree: null,
  validatorData: new Map(),
});
