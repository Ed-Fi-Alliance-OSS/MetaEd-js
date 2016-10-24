// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { decimalPropertyErrorRule, includeDecimalPropertyRule } from './DecimalPropertyValidationRule';
import { valid } from '../CommonSimpleType/CommonDecimalMinValueMustNotBeGreaterThanMaxValue';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Decimal Property '${ruleContext.propertyName().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min value greater than max value.`;
}

const validationRule = decimalPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDecimalPropertyRule(validationRule);
