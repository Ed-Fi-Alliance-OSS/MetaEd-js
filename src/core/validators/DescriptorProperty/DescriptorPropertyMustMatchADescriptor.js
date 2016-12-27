// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.descriptorEntity(), ruleContext.propertyName().ID().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Descriptor property '${ruleContext.propertyName().ID().getText()}' does not match any declared descriptor.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_descriptorProperty, validationRule);
