// @flow
import R from 'ramda';
import { getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';

function getIdentityRenames(ruleContext: any): Array<any> {
  return ruleContext.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null)
  .map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename());
}

function getBasePropertyIdentifierFor(identityRenames: Array<any>): any {
  return R.head(identityRenames).baseKeyName().getText();
}

export const valid = R.curry(
  (baseKey: string, ruleContext: any, symbolTable: SymbolTable): boolean => {
    const identityRenames = getIdentityRenames(ruleContext);
    if (identityRenames.length === 0) return true;

    const baseIdentifier = ruleContext.baseName().getText();
    const baseSymbolTable = symbolTable.get(baseKey, baseIdentifier);
    if (baseSymbolTable == null) return true;

    const baseProperty = baseSymbolTable.propertySymbolTable.get(getBasePropertyIdentifierFor(identityRenames));
    if (baseProperty == null) return false;

    return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
  });

/* eslint-disable no-unused-vars */
export const failureMessage = R.curry(
  (entityTitle: string, identifierFinder: (ruleContext: any) => string, ruleContext: any, symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const basePropertyIdentifier = getBasePropertyIdentifierFor(getIdentityRenames(ruleContext));
    return `${entityTitle} '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
  });
