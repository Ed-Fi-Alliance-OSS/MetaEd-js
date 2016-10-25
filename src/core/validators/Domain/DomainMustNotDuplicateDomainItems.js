// @flow
import type SymbolTable from '../SymbolTable';
import { domainErrorRule, includeDomainRule } from './DomainValidationRule';
import { findDuplicates } from '../ValidationHelper';

function getDomainItemNames(ruleContext: any) {
  return ruleContext.domainItem().map(x => x.ID().getText());
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return findDuplicates(getDomainItemNames(ruleContext)).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.domainName().ID().getText();
  const duplicates = findDuplicates(getDomainItemNames(ruleContext));
  const joinString = '\', \'';
  return `Domain '${identifier}' declares duplicate domain item${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

const validationRule = domainErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainRule(validationRule);
