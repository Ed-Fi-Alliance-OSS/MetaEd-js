// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { stringPropertyErrorRule, includeStringPropertyRule } from './StringPropertyValidationRule';
import { valid } from '../CommonSimpleType/CommonStringMinLengthMustNotBeGreaterThanMaxLength';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `String Property '${ruleContext.propertyName().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min length greater than max length.`;
}

const validationRule = stringPropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeStringPropertyRule(validationRule);
