// @flow
import { getProperty } from '../ValidationHelper';
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import type SymbolTable from '../SymbolTable';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identityRenameCount = ruleContext.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null).length;
  return identityRenameCount <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  const identifier = ruleContext.associationName().getText();
  const baseIdentifier = ruleContext.baseName().getText();
  const identityRenames = ruleContext.property().map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);
  const basePropertyIdentifier = identityRenames.map(pkr => pkr.baseKeyName().getText()).join(', ');
  return `Association '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Association.`;
}

const validationRule = associationSubclassErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
