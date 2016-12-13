// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.parentCtx.ruleIndex !== MetaEdGrammar.RULE_referenceProperty) return false;
  const firstPropertyPathPart = ruleContext.mergePropertyPath().propertyPath().ID().map(x => x.getText())[0];
  return firstPropertyPathPart === ruleContext.parentCtx.propertyName().ID().getText();
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return 'Merge statement must startingFromFileLoad first property path with the referenced entity name of the current property.';
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePartOfReference, validationRule);
