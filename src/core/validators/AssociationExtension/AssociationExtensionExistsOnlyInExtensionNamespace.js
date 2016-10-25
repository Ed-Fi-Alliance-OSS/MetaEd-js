// @flow
import { associationExtensionErrorRule, includeAssociationExtensionRule } from './AssociationExtensionValidationRule';
import type SymbolTable from '../SymbolTable';
import { namespaceAncestorContext, isExtensionNamespace, namespaceNameFor } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return isExtensionNamespace(parentNamespaceContext);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return `Association additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = associationExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationExtensionRule(validationRule);
