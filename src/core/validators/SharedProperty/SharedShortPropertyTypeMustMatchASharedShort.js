// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'SharedShortPropertyTypeMustMatchASharedShort';
  const invalidPath: ?string[] = exceptionPath(['sharedPropertyType', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };
  return { validatorName };
}

const validationRule = errorRuleBase(validatable, validForShared(SymbolTableEntityType.sharedShort()), failureMessageForShared('common short'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedShortProperty, validationRule);
