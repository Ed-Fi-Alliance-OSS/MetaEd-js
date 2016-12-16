// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.extendeeName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch)
    || symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity additions '${ruleContext.extendeeName().getText()}' does not match any declared Domain Entity or subclass.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntityExtension, validationRule);
