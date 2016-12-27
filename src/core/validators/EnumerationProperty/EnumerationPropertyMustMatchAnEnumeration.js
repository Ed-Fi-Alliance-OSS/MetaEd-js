// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.enumeration(), ruleContext.propertyName().ID().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Enumeration property '${ruleContext.propertyName().ID().getText()}' does not match any declared enumeration.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_enumerationProperty, validationRule);
