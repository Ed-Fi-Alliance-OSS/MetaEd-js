// @flow
import { domainEntityExtensionErrorRule, includeDomainEntityExtensionRule } from './DomainEntityExtensionValidationRule';
import type SymbolTable from '../SymbolTable';
import { namespaceAncestorContext, namespaceNameFor } from '../ValidationHelper';
import { valid } from '../AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace';

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return `Domain Entity additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = domainEntityExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntityExtensionRule(validationRule);
