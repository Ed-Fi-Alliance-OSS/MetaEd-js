// @flow
import { exceptionPath } from '../ValidationHelper';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import SymbolTable from '../SymbolTable';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'AssociationMustNotDuplicateDomainEntityNames';
  let invalidPath: ?string[] = exceptionPath(['firstDomainEntity', 'propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['secondDomainEntity', 'propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  if (ruleContext.firstDomainEntity().withContext()) {
    invalidPath = exceptionPath(['firstDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };
  }

  if (ruleContext.secondDomainEntity().withContext()) {
    invalidPath = exceptionPath(['secondDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext);
    if (invalidPath) return { invalidPath, validatorName };
  }

  return { validatorName };
}

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

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_association, validationRule);
