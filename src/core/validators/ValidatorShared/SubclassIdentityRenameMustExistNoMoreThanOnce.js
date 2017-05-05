// @flow
import R from 'ramda';
import { getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';

export { validatable } from './SubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.property().filter(p => getProperty(p).propertyComponents().propertyAnnotation().identityRename() != null).length <= 1;
}

/* eslint-disable no-unused-vars */
export const failureMessage = R.curry(
  (entityTitle: string, identifierFinder: (ruleContext: any) => string, ruleContext: any, symbolTable: SymbolTable): string => {
    const identifier = identifierFinder(ruleContext);
    const baseIdentifier = ruleContext.baseName().getText();
    const identityRenames = ruleContext.property().map(p => getProperty(p).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);
    const basePropertyIdentifier = identityRenames.map(ir => ir.baseKeyName().getText()).join(', ');
    return `${entityTitle} '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given ${entityTitle}.`;
  });
