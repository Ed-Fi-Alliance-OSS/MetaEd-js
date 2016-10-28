// @flow
import type SymbolTable from '../SymbolTable';
import { subdomainErrorRule, includeSubdomainRule } from './SubdomainValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.domain(), ruleContext.parentDomainName().ID().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Subdomain '${ruleContext.subdomainName().ID().getText()}' is part of '${ruleContext.parentDomainName().ID().getText()}' which does not match any declared domain.`;
}

const validationRule = subdomainErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeSubdomainRule(validationRule);
