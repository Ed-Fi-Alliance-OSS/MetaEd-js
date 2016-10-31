// @flow
import type SymbolTable from '../SymbolTable';
import { warningRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { topLevelEntityAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName, propertyRules } from '../RuleInformation';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.metaEdId() && ruleContext.metaEdId().METAED_ID().getText();
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const propertyName = ruleContext.propertyName().ID().getText();
  return `Property '${propertyName}' on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}' is missing a MetaEdId value.`;
}

const validationRule = warningRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(propertyRules, validationRule);
