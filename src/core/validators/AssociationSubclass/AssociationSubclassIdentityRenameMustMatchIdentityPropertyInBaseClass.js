// @flow
import R from 'ramda';
import { getProperty } from '../ValidationHelper';
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import type SymbolTable from '../SymbolTable';

function getIdentityRenames(ruleContext: any): Array<any> {
  return ruleContext.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null)
  .map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename());
}

function getBasePropertyIdentifierFor(identityRenames: Array<any>): any {
  return R.head(identityRenames).baseKeyName().getText();
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
  const identityRenames = getIdentityRenames(ruleContext);
  if (identityRenames.length === 0) return true;

  const baseIdentifier = ruleContext.baseName().getText();
  const baseSymbolTable = symbolTable.get(ruleContext.ASSOCIATION().getText(), baseIdentifier);
  if (baseSymbolTable == null) return true;

  const baseProperty = baseSymbolTable.propertySymbolTable.get(getBasePropertyIdentifierFor(identityRenames));
  if (baseProperty == null) return false;

  return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
  const identifier = ruleContext.associationName().getText();
  const baseIdentifier = ruleContext.baseName().getText();
  const basePropertyIdentifier = getBasePropertyIdentifierFor(getIdentityRenames(ruleContext));
  return `Association '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
}

const validationRule = associationSubclassErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
