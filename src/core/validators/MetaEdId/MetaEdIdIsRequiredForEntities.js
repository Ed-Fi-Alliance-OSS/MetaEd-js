// @flow
import type SymbolTable from '../SymbolTable';
import { warningRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { topLevelEntityRules } from '../RuleInformation';
import { entityNameExceptionPath, entityIdentifierExceptionPath, entityIdentifier, entityName } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'MetaEdIdIsRequiredForEntities';
  let invalidPath: ?string[] = entityNameExceptionPath(ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = entityIdentifierExceptionPath(ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.metaEdId() && ruleContext.metaEdId().METAED_ID();
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `${entityIdentifier(ruleContext)} '${entityName(ruleContext)}' is missing a MetaEdId value.`;
}

const validationRule = warningRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(topLevelEntityRules, validationRule);
