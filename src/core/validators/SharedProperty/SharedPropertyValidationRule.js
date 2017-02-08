// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';

export const validForShared = R.curry(
  (entityKey: string, ruleContext: any, symbolTable: SymbolTable): boolean =>
  symbolTable.identifierExists(entityKey, ruleContext.sharedPropertyType().getText()));

function sharedPropertyName(propertyRuleContext: any) {
  return propertyRuleContext.propertyName() ? propertyRuleContext.propertyName().ID().getText() :
    propertyRuleContext.sharedPropertyType().ID().getText();
}

/* eslint-disable no-unused-vars */
export const failureMessageForShared = R.curry(
  (entityTitle: string, ruleContext: any, symbolTable: SymbolTable): string =>
    `Shared property '${sharedPropertyName(ruleContext)}' does not match any declared ${entityTitle}.`);
