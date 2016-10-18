// @flow
import R from 'ramda';

import ValidationLevel from './ValidationLevel';
import SymbolTable from './SymbolTable';

// base of all validation rules
function validationRuleBase(errorLevel: ValidationLevel,
                           handled: (ruleContext: any) => boolean,
                           valid: (ruleContext: any, symbolTable: SymbolTable) => boolean,
                           failureMessage: (ruleContext: any, symbolTable: SymbolTable) => string,
                           ruleContext: any,
                           symbolTable: SymbolTable) : ValidationResult {
  const result : ValidationResult = {
    handled: handled(ruleContext)
  };

  if (!result.handled) return result;
  result.errorLevel = errorLevel;
  result.valid = valid(ruleContext, symbolTable);

  if (result.valid) return result;

  result.failureMessage = failureMessage(ruleContext, symbolTable);
  return result;
}


// rule base curried for composition
const curriedValidationRuleBase = R.curry(validationRuleBase);
export const errorValidationRuleBase = curriedValidationRuleBase(ValidationLevel.Error);
export const warningValidationRuleBase = curriedValidationRuleBase(ValidationLevel.Warning);


// flow types for validation rules
export type ValidationRule = (ruleContext: any, symbolTable: SymbolTable) => ValidationResult;

export type ValidationResult = {
    handled: boolean,
    errorLevel?: ValidationLevel,
    valid?: boolean,
    failureMessage?: string
};

