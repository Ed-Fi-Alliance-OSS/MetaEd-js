// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import { findDuplicates } from '../ValidationHelper';

function getShortDescriptions(ruleContext: any) {
  return ruleContext.withMapType().enumerationItem().map(x => x.shortDescription().getText());
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.withMapType() == null) return true;
  const shortDescriptions = getShortDescriptions(ruleContext);
  if (shortDescriptions.length === 0) return true;
  return findDuplicates(shortDescriptions).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.descriptorName().getText();
  const duplicates = findDuplicates(getShortDescriptions(ruleContext));
  const joinString = '\', \'';
  return `Descriptor '${identifier}' declares duplicate item${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_descriptor, validationRule);
