// @flow
import R from 'ramda';
import ValidationLevel from './ValidationLevel';
import SymbolTable from './SymbolTable';

export type ValidationResult = {
  errorLevel?: ValidationLevel,
  valid?: boolean,
  failureMessage?: string
};

export type ValidationRule = (ruleContext: any, symbolTable: SymbolTable) => ValidationResult;

// base of all validation rules
const validationRuleBase = R.curry(
  (errorLevel: ValidationLevel,
   valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
   failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
   ruleContext: any,
   symbolTable: SymbolTable): ValidationResult => {
    const result: ValidationResult = {
      errorLevel,
    };

    result.valid = valid(ruleContext, symbolTable);
    if (result.valid) return result;

    result.failureMessage = failureMessage(ruleContext, symbolTable);
    return result;
  }
);

export const errorRuleBase = validationRuleBase(ValidationLevel.Error);
export const warningRuleBase = validationRuleBase(ValidationLevel.Warning);
