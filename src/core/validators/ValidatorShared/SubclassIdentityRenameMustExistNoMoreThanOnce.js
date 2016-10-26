// @flow
import R from 'ramda';
import { getProperty } from '../ValidationHelper';
import type SymbolTable from '../SymbolTable';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identityRenameCount = ruleContext.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null).length;
  return identityRenameCount <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessageUncurried(entityTitle: string, identifierFinder: (ruleContext: any) => string, ruleContext: any, symbolTable: SymbolTable) : string {
  const identifier = identifierFinder(ruleContext);
  const baseIdentifier = ruleContext.baseName().getText();
  const identityRenames = ruleContext.property().map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);
  const basePropertyIdentifier = identityRenames.map(pkr => pkr.baseKeyName().getText()).join(', ');
  return `${entityTitle} '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given ${entityTitle}.`;
}

export const failureMessage = R.curry(failureMessageUncurried);
