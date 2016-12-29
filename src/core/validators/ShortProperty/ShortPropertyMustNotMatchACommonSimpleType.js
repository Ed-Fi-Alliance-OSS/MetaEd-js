// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { propertyMustNotMatchACommonSimpleType, exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'ShortPropertyMustNotMatchACommonSimpleType';
  const invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Short property '${ruleContext.propertyName().ID().getText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
}

const validationRule = errorRuleBase(validatable, propertyMustNotMatchACommonSimpleType, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_shortProperty, validationRule);
