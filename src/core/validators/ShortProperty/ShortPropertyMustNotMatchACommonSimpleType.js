// @flow
import type SymbolTable from '../SymbolTable';
import { shortPropertyErrorRule, includeShortPropertyRule } from './ShortPropertyValidationRule';
import { propertyMustNotMatchACommonSimpleType } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Short property '${ruleContext.propertyName().getText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
}

const validationRule = shortPropertyErrorRule(propertyMustNotMatchACommonSimpleType, failureMessage);
export { validationRule as default };

export const includeRule = includeShortPropertyRule(validationRule);
