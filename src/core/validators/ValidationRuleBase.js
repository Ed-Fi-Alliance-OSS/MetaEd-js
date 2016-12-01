// @flow
import R from 'ramda';
import ValidationLevel from './ValidationLevel';
import type { ValidationMessage } from './ValidationMessage';
import type { State } from '../State';
import type SymbolTable from './SymbolTable';
import { IMetaEdFileIndex } from '../tasks/IMetaEdFileIndex';

export type ValidationRule = (ruleContext: any, state: State) => State;

function buildValidationMessage(failureMessage: ?string, start: any, metaEdFileIndex: IMetaEdFileIndex): ValidationMessage {
  const metaEdFile = metaEdFileIndex.getFilenameAndLineNumber(start.line);
  return {
    message: failureMessage == null ? 'ERROR: Failure, but no failure message provided' : failureMessage,
    characterPosition: start.column,
    concatenatedLineNumber: start.line,
    filename: metaEdFile.filename,
    lineNumber: metaEdFile.lineNumber,
  };
}

// base of all validation rules
const validationRuleBase = R.curry(
  (errorLevel: ValidationLevel,
   valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   state: State): State => {
    let nextState = state;
    const isValid = valid(ruleContext, state.get('symbolTable'));
    if (isValid) return state;

    const message = buildValidationMessage(failureMessage(ruleContext, state.get('symbolTable')), ruleContext.start, state.get('metaEdFileIndex'));
    if (errorLevel === ValidationLevel.Error) {
      nextState = nextState.set('errorMessageCollection', nextState.get('errorMessageCollection').push(message))
      .set('action', nextState.get('action').push('ValidationRuleBase'));
    } else if (errorLevel === ValidationLevel.Warning) {
      nextState = nextState.set('warningMessageCollection', nextState.get('warningMessageCollection').push(message))
      .set('action', nextState.get('action').push('ValidationRuleBase'));
    } else throw new Error('ValidationRuleBase: Received error level of unknown type');
    return nextState;
  });

export const errorRuleBase = validationRuleBase(ValidationLevel.Error);
export const warningRuleBase = validationRuleBase(ValidationLevel.Warning);
