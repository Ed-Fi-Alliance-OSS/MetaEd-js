// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { domainEntityErrorRule, includeDomainEntityRule } from './DomainEntityValidationRule';
import { namespaceAncestorContext, getProperty } from '../ValidationHelper';

function isExtension(namespaceContext: any): boolean {
  return namespaceContext.namespaceType().namespaceProjectExtension() != null;
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const namespaceContext = namespaceAncestorContext(ruleContext);
  return isExtension(namespaceContext) || R.map(x => getProperty(x).propertyName() === 'UniqueId', ruleContext.property()).length <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity ${ruleContext.entityName().ID().getText()} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`;
}

const validationRule = domainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntityRule(validationRule);
