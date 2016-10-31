// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

export const validForDomainEntityOrAssociationOrSubclass = (ruleContext: any, symbolTable: SymbolTable): boolean => {
  const identifierToMatch = ruleContext.ID().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
};

// eslint-disable-next-line no-unused-vars
export const failureMessageForEntityTitle = R.curry((entityTitle: string, ruleContext: any, symbolTable: SymbolTable): string =>
  `${entityTitle} '${ruleContext.ID().getText()}' does not match any declared domain entity or subclass, association or subclass.`);
