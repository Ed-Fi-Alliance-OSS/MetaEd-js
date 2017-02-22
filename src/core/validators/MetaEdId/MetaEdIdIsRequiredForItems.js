// @flow
import type SymbolTable from '../SymbolTable';
import { warningRuleBase } from '../ValidationRuleBase';
import { includeRuleBaseForMultiRuleIndexes } from '../ValidationRuleRepository';
import { topLevelEntityAncestorContext, itemNameExceptionPath, entityNameExceptionPath, entityIdentifierExceptionPath,
  entityIdentifier, entityName, itemName } from '../ValidationHelper';
import { itemRules } from '../RuleInformation';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'MetaEdIdIsRequiredForItems';

  let invalidPath: ?string[] = itemNameExceptionPath(ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  const parentEntityContext = topLevelEntityAncestorContext(ruleContext);
  invalidPath = entityNameExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = entityIdentifierExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return ruleContext.metaEdId() && ruleContext.metaEdId().METAED_ID();
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return `Item '${itemName(ruleContext)}' on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}' is missing a MetaEdId value.`;
}

const validationRule = warningRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBaseForMultiRuleIndexes(itemRules, validationRule);
