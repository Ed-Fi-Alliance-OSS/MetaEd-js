// @flow
import type SymbolTable from '../SymbolTable';
import { parentIdentifierForPropertyContext, parentTypeNameForPropertyContext } from '../../../grammar/ParserRuleContextExtensions';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { valid } from '../CommonSimpleType/CommonStringMinLengthMustNotBeGreaterThanMaxLength';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `String Property '${ruleContext.propertyName().ID().getText()}' in ${parentTypeNameForPropertyContext(ruleContext)}` +
    ` '${parentIdentifierForPropertyContext(ruleContext)}' has min length greater than max length.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_stringProperty, validationRule);
