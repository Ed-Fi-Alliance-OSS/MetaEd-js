// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validForShared, failureMessageForShared } from './SharedPropertyValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'SharedIntegerPropertyTypeMustMatchASharedInteger';
  const invalidPath: ?string[] = exceptionPath(['sharedPropertyType', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };
  return { validatorName };
}

const validationRule = errorRuleBase(validatable, validForShared(SymbolTableEntityType.sharedInteger()), failureMessageForShared('common integer'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_sharedIntegerProperty, validationRule);
