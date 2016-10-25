// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { integerPropertyErrorRule, includeIntegerPropertyRule } from './IntegerPropertyValidationRule';
import { valid } from '../CommonSimpleType/CommonIntegerMinValueMustNotBeGreaterThanMaxValue';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Integer Property '${ruleContext.propertyName().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min value greater than max value.`;
}

const validationRule = integerPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIntegerPropertyRule(validationRule);

