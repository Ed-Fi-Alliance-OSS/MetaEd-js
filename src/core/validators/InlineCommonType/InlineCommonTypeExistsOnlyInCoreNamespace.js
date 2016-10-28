// @flow
import R from 'ramda';
import { inlineCommonTypePropertyErrorRule, includeInlineCommonTypePropertyRule } from './InlineCommonTypeValidationRule';
import type SymbolTable from '../SymbolTable';
import { namespaceAncestorContext, isExtensionNamespace, namespaceNameFor } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return R.compose(R.not, isExtensionNamespace, namespaceAncestorContext)(ruleContext);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentNamespaceContext = namespaceAncestorContext(ruleContext);
  return `Inline Common Type '${ruleContext.inlineCommonName().ID().getText()}' is not valid in extension namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = inlineCommonTypePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInlineCommonTypePropertyRule(validationRule);
