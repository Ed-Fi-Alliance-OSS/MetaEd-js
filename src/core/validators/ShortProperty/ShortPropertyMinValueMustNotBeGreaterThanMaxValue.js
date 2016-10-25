// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { shortPropertyErrorRule, includeShortPropertyRule } from './ShortPropertyValidationRule';
import { valid } from '../CommonSimpleType/CommonShortMinValueMustNotBeGreaterThanMaxValue';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Short Property '${ruleContext.propertyName().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min value greater than max value.`;
}

const validationRule = shortPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeShortPropertyRule(validationRule);
