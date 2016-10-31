// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identifierToMatch = ruleContext.extendeeName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  return `Association additions '${ruleContext.extendeeName().getText()}' does not match any declared Association or subclass.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationExtension, validationRule);
