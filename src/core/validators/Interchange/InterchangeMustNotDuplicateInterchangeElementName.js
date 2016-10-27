// @flow
import type SymbolTable from '../SymbolTable';
import { interchangeErrorRule, includeInterchangeRule } from './InterchangeValidationRule';
import { findDuplicates } from '../ValidationHelper';

function idsToCheck(ruleContext: any): string[] {
  return ruleContext.interchangeComponent().interchangeElement().map(x => x.ID().getText());
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return findDuplicates(idsToCheck(ruleContext)).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.interchangeName().getText();
  const duplicates = findDuplicates(idsToCheck(ruleContext));
  const joinString = '\', \'';
  return `Interchange '${identifier}' declares duplicate interchange element${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

const validationRule = interchangeErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInterchangeRule(validationRule);
