// @flow
import R from 'ramda';
import ValidationLevel from './ValidationLevel';
import {
  addAction,
  addErrorMessage,
  addWarningMessage,
  addValidationProblem } from '../State';
import type { ValidationMessage, ValidatableResult } from './ValidationTypes';
import type { State } from '../State';
import type SymbolTable from './SymbolTable';
import type { FileIndex } from '../tasks/FileIndex';
import { getFilenameAndLineNumber } from '../tasks/FileIndex';

export type ValidationRule = (ruleContext: any, state: State) => State;

function buildValidationMessage(validatorName: string, failureMessage: ?string, start: any, fileIndex: FileIndex): ValidationMessage {
  const { filename, lineNumber } = getFilenameAndLineNumber(fileIndex, start.line);
  return {
    validatorName,
    message: failureMessage == null ? 'ERROR: Failure, but no failure message provided' : failureMessage,
    characterPosition: start.column,
    concatenatedLineNumber: start.line,
    filename,
    lineNumber,
    tokenText: start.text,
  };
}

function addValidationMessage(validatorName: string,
  errorLevel: ValidationLevel,
  failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
  ruleContext: any,
  state: State): State {
  const message = buildValidationMessage(validatorName, failureMessage(ruleContext, state.get('symbolTable')), ruleContext.start, state.get('fileIndex'));
  if (errorLevel === ValidationLevel.Error) {
    return R.pipe(addErrorMessage(message), addAction('ValidationRuleBase'))(state);
  } else if (errorLevel === ValidationLevel.Warning) {
    return R.pipe(addWarningMessage(message), addAction('ValidationRuleBase'))(state);
  }
  throw new Error('ValidationRuleBase: Received error level of unknown type');
}

// base of all validation rules that only require symbol table as read-only
const validationRuleBase = R.curry(
  (errorLevel: ValidationLevel,
   validatable: (ruleContext: any) => ValidatableResult,
   valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   state: State): State => {
    const { validatorName, invalidPath } = validatable(ruleContext);
    if (invalidPath) return addValidationProblem({ validatorName, reason: invalidPath.join(' -> ') }, state);
    const isValid = valid(ruleContext, state.get('symbolTable'));
    if (isValid) return state;
    return addValidationMessage(validatorName, errorLevel, failureMessage, ruleContext, state);
  });

// base of all validation rules that require ability for validation method to return new state
const validationRuleStateModifying = R.curry(
  (errorLevel: ValidationLevel,
   validatable: (ruleContext: any) => ValidatableResult,
   validAndNextState: (ruleContext: any, state: State) => { isValid: boolean, nextState: State },
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   state: State): State => {
    const { validatorName, invalidPath } = validatable(ruleContext);
    if (invalidPath) return addValidationProblem({ validatorName, reason: invalidPath.join(' -> ') }, state);
    const { isValid, nextState } = validAndNextState(ruleContext, state);
    if (isValid) return nextState;

    return addValidationMessage(validatorName, errorLevel, failureMessage, ruleContext, nextState);
  });

export const errorRuleBase = validationRuleBase(ValidationLevel.Error);
export const warningRuleBase = validationRuleBase(ValidationLevel.Warning);

export const errorRuleBaseStateModifying = validationRuleStateModifying(ValidationLevel.Error);
