// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
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

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_inlineCommonType, validationRule);
