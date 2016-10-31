// @flow
import type SymbolTable from '../SymbolTable';
import { warningRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { topLevelEntityAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName, itemName, itemRules } from '../RuleInformation';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.metaEdId() && ruleContext.metaEdId().METAED_ID().getText();
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return `Item '${itemName(ruleContext)}' on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}' is missing a MetaEdId value.`;
}

const validationRule = warningRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(itemRules, validationRule);
