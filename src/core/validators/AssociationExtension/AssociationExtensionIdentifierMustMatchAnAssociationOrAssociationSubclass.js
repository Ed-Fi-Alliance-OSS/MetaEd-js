// @flow
import { associationExtensionErrorRule, includeAssociationExtensionRule } from './AssociationExtensionValidationRule';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identifierToMatch = ruleContext.extendeeName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.associationEntityType(), identifierToMatch)
        || symbolTable.identifierExists(SymbolTableEntityType.associationSubclassEntityType(), identifierToMatch);
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  return `Association additions '${ruleContext.extendeeName().getText()}' does not match any declared Association or subclass.`;
}

const validationRule = associationExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationExtensionRule(validationRule);
