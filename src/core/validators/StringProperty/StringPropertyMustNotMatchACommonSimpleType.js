// @flow
import type SymbolTable from '../SymbolTable';
import { stringPropertyErrorRule, includeStringPropertyRule } from './StringPropertyValidationRule';
import { propertyMustNotMatchACommonSimpleType } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `String property '${ruleContext.propertyName().getText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
}

const validationRule = stringPropertyErrorRule(propertyMustNotMatchACommonSimpleType, failureMessage);
export { validationRule as default };

export const includeRule = includeStringPropertyRule(validationRule);
