// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'SubdomainParentDomainNameMustMatchADomain';
  let invalidPath: ?string[] = exceptionPath(['parentDomainName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['subdomainName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return symbolTable.identifierExists(SymbolTableEntityType.domain(), ruleContext.parentDomainName().ID().getText());
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Subdomain '${ruleContext.subdomainName().ID().getText()}' is part of '${ruleContext.parentDomainName().ID().getText()}' which does not match any declared domain.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_subdomain, validationRule);
