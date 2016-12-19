// @flow
import R from 'ramda';
import { List, Map, Record, Set } from 'immutable';
import SymbolTable from './validators/SymbolTable';
import type { ValidationMessage, ValidationProblem } from './validators/ValidationTypes';
import type { InputDirectory } from './tasks/FileSystemFilenameLoader';
import type { FileSet } from './tasks/MetaEdFile';
import type { FileIndex } from './tasks/FileIndex';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';

type StateRecord = {
  // every function/object that changes the state must append their name here
  action: List<string>,

  // the collection of error messages from syntax and semantic validation, and other processes
  errorMessages: List<ValidationMessage>,

  // the collection of warning messages from semantic validation
  warningMessages: List<ValidationMessage>,

  // the collection of indeterminate validations from semantic validation
  validationProblems: List<ValidationProblem>,

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
  warningMessages: new List(),
  errorMessages: new List(),
  validationProblems: new List(),
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

export const addErrorMessage = R.curry((errorMessage: ValidationMessage, state: State): State =>
  state.set('errorMessages', state.get('errorMessages').push(errorMessage)));

export const concatenateErrorMessages = R.curry((errorMessages: ValidationMessage[], state: State): State =>
  state.set('errorMessages', state.get('errorMessages').concat(errorMessages)));

export const addWarningMessage = R.curry((warningMessage: ValidationMessage, state: State): State =>
  state.set('warningMessages', state.get('warningMessages').push(warningMessage)));

export const addValidationProblem = R.curry((validationProblem: ValidationProblem, state: State): State =>
  state.set('validationProblems', state.get('validationProblems').push(validationProblem)));

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
