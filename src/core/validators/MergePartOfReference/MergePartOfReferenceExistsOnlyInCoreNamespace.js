// @flow
import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import { entityIdentifier, entityName } from '../RuleInformation';
import { namespaceAncestorContext, topLevelEntityAncestorContext, propertyAncestorContext,
  isExtensionNamespace, namespaceNameFor } from '../ValidationHelper';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return R.compose(R.not, isExtensionNamespace, namespaceAncestorContext)(ruleContext);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const namespaceName = namespaceNameFor(namespaceAncestorContext(ruleContext));
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const propertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'merge' is invalid for property ${propertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}' in extension namespace ${namespaceName}.  'merge' is only valid for properties on types in a core namespace.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePartOfReference, validationRule);
