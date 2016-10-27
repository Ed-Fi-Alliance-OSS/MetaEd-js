// @flow
import type SymbolTable from '../SymbolTable';
import { includeReferencePropertyRule, referencePropertyErrorRule } from './ReferencePropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifierToMatch = ruleContext.propertyName().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Reference property '${ruleContext.propertyName().getText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
}

const validationRule = referencePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeReferencePropertyRule(validationRule);
