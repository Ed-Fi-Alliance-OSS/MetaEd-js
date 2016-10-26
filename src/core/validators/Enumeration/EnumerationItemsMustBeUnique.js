// @flow
import type SymbolTable from '../SymbolTable';
import { enumerationErrorRule, includeEnumerationRule } from './EnumerationValidationRule';
import { findDuplicates } from '../ValidationHelper';

function getShortDescriptions(ruleContext: any) {
  return ruleContext.enumerationItem().map(x => x.shortDescription().getText());
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const shortDescriptions = getShortDescriptions(ruleContext);
  if (shortDescriptions.length === 0) return true;
  return findDuplicates(shortDescriptions).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.enumerationName().getText();
  const duplicates = findDuplicates(getShortDescriptions(ruleContext));
  const joinString = '\', \'';
  return `Enumeration '${identifier}' declares duplicate item${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

const validationRule = enumerationErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeEnumerationRule(validationRule);
