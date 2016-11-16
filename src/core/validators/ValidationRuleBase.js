// @flow
import R from 'ramda';
import ValidationLevel from './ValidationLevel';
import type { ValidationMessage } from './ValidationMessage';
import type { State } from '../State';
import { MetaEdFileIndex } from '../../grammar/IMetaEdFileIndex';
import type SymbolTable from './SymbolTable';

export type ValidationRule = (ruleContext: any, state: State) => State;

function buildValidationMessage(failureMessage: ?string, start: any, metaEdFileIndex: MetaEdFileIndex): ValidationMessage {
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
    const nextState = state;
    const isValid = valid(ruleContext, state.symbolTable);
    if (isValid) return state;

    const message = buildValidationMessage(failureMessage(ruleContext, state.symbolTable), ruleContext.start, state.metaEdFileIndex);
    if (errorLevel === ValidationLevel.Error) {
      nextState.errorMessageCollection = nextState.errorMessageCollection.push(message);
    } else if (errorLevel === ValidationLevel.Warning) {
      nextState.warningMessageCollection = nextState.warningMessageCollection.push(message);
    } else throw new Error('ValidationRuleBase: Received error level of unknown type');
    return nextState;
  }
);

export const errorRuleBase = validationRuleBase(ValidationLevel.Error);
export const warningRuleBase = validationRuleBase(ValidationLevel.Warning);
