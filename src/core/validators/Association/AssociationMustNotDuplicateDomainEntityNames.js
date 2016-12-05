// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTable from '../SymbolTable';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const firstDomainEntityName = ruleContext.firstDomainEntity().propertyName().ID().getText();
  const secondDomainEntityName = ruleContext.secondDomainEntity().propertyName().ID().getText();
  if (firstDomainEntityName !== secondDomainEntityName) return true;
  const firstContext = ruleContext.firstDomainEntity().withContext();
  const secondContext = ruleContext.secondDomainEntity().withContext();
  const firstContextName = firstContext == null ? '' : firstContext.withContextName().ID().getText();
  const secondContextName = secondContext == null ? '' : secondContext.withContextName().ID().getText();
  return firstContextName !== secondContextName;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.associationName().getText();
  const firstDomainEntityName = ruleContext.firstDomainEntity().propertyName().ID().getText();
  return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_association, validationRule);
