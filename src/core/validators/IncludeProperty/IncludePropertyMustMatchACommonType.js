// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.commonType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.inlineCommonType(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.choiceType(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Include property '${ruleContext.propertyName().getText()}' does not match any declared common type, inline common type, or choice type.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_includeProperty, validationRule);
