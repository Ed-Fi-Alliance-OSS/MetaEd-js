// @flow
import R from 'ramda';
import { List, Map, Record, Set } from 'immutable';
import { compose as composeLens, get as getLens, set as setLens } from 'safety-lens';
import { field as fieldLens } from 'safety-lens/immutable';
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

  // the collection of indeterminate validations from semantic validation
  indeterminateCollection: List<string>,

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

export const addAction = R.curry((actionString: string, state: State): State =>
  state.set('action', state.get('action').push(actionString)));

export const addErrorMessage = R.curry((errorMessage: string, state: State): State =>
  state.set('errorMessageCollection', state.get('errorMessageCollection').push(errorMessage)));

export const concatenateErrorMessages = R.curry((errorMessages: string[], state: State): State =>
  state.set('errorMessageCollection', state.get('errorMessageCollection').concat(errorMessages)));

export const addWarningMessage = R.curry((warningMessage: string, state: State): State =>
  state.set('warningMessageCollection', state.get('warningMessageCollection').push(warningMessage)));

export const addLoadedFileSet = R.curry((fileSet: FileSet, state: State): State =>
  state.set('loadedFileSet', state.get('loadedFileSet').concat(fileSet)));

export const addFilepathsToExclude = R.curry((filepaths: string, state: State): State =>
  state.set('filepathsToExclude', state.get('filepathsToExclude').concat(filepaths)));

export const setFileIndex = R.curry((fileIndex: FileIndex, state: State): State =>
  state.set('fileIndex', fileIndex));

export const setParseTree = R.curry((parseTree: ?MetaEdGrammar, state: State): State =>
  state.set('parseTree', parseTree));

export const setValidatorData = R.curry((validatorData: Map<string, string>, state: State): State =>
  state.set('validatorData', validatorData));

export const setSymbolTable = R.curry((symbolTable: ?SymbolTable, state: State): State =>
  state.set('symbolTable', symbolTable));
