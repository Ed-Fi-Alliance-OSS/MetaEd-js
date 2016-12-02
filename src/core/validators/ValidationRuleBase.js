// @flow
import R from 'ramda';
import ValidationLevel from './ValidationLevel';
import type { ValidationMessage } from './ValidationMessage';
import type { State } from '../State';
import type SymbolTable from './SymbolTable';
import type { FileIndex } from '../tasks/FileIndex';
// eslint-disable-next-line no-duplicate-imports
import { getFilenameAndLineNumber } from '../tasks/FileIndex';

export type ValidationRule = (ruleContext: any, state: State) => State;

function buildValidationMessage(failureMessage: ?string, start: any, fileIndex: FileIndex): ValidationMessage {
  const { filename, lineNumber } = getFilenameAndLineNumber(fileIndex, start.line);
  return {
    message: failureMessage == null ? 'ERROR: Failure, but no failure message provided' : failureMessage,
    characterPosition: start.column,
    concatenatedLineNumber: start.line,
    filename,
    lineNumber,
  };
}

function pushValidationMessage(errorLevel: ValidationLevel,
  failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
  ruleContext: any,
  state: State): State {
  let nextState = state;
  const message = buildValidationMessage(failureMessage(ruleContext, state.get('symbolTable')), ruleContext.start, state.get('fileIndex'));
  if (errorLevel === ValidationLevel.Error) {
    nextState = nextState.set('errorMessageCollection', nextState.get('errorMessageCollection').push(message))
    .set('action', nextState.get('action').push('ValidationRuleBase'));
  } else if (errorLevel === ValidationLevel.Warning) {
    nextState = nextState.set('warningMessageCollection', nextState.get('warningMessageCollection').push(message))
    .set('action', nextState.get('action').push('ValidationRuleBase'));
  } else throw new Error('ValidationRuleBase: Received error level of unknown type');
  return nextState;
}

// base of all validation rules that only require symbol table as read-only
const validationRuleBase = R.curry(
  (errorLevel: ValidationLevel,
   valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   state: State): State => {
    const isValid = valid(ruleContext, state.get('symbolTable'));
    if (isValid) return state;
    return pushValidationMessage(errorLevel, failureMessage, ruleContext, state);
  });

// base of all validation rules that require ability for validation method to return new state
const validationRuleStateModifying = R.curry(
  (errorLevel: ValidationLevel,
   validAndNextState: (ruleContext: any, state: State) => { isValid: boolean, nextState: State },
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   state: State): State => {
    // eslint-disable-next-line prefer-const
    let { isValid, nextState } = validAndNextState(ruleContext, state);
    if (isValid) return nextState;

    return pushValidationMessage(errorLevel, failureMessage, ruleContext, nextState);
  });

export const errorRuleBase = validationRuleBase(ValidationLevel.Error);
export const warningRuleBase = validationRuleBase(ValidationLevel.Warning);

export const errorRuleBaseStateModifying = validationRuleStateModifying(ValidationLevel.Error);
