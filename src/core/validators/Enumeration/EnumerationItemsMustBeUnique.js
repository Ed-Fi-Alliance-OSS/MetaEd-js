// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { findDuplicates, exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

function getShortDescriptions(ruleContext: any) {
  return ruleContext.enumerationItem().map(x => x.shortDescription().TEXT().getText());
}

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'EnumerationItemsMustBeUnique';
  let invalidPath: ?string[] = exceptionPath(['enumerationItem'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const enumerationItem of ruleContext.enumerationItem()) {
    invalidPath = exceptionPath(['shortDescription', 'TEXT'], enumerationItem);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = exceptionPath(['enumerationName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const shortDescriptions = getShortDescriptions(ruleContext);
  if (shortDescriptions.length === 0) return true;
  return findDuplicates(shortDescriptions).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.enumerationName().ID().getText();
  const duplicates = findDuplicates(getShortDescriptions(ruleContext));
  const joinString = '\', \'';
  return `Enumeration '${identifier}' declares duplicate item${duplicates.length > 1 ? 's' : ''} '${duplicates.join(joinString)}'.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_enumeration, validationRule);
