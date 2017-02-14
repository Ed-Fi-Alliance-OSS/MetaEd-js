// @flow
import { validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle } from './InterchangeValidationRule';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type { ValidatableResult } from '../ValidationTypes';
import { exceptionPath } from '../ValidationHelper';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass';
  const invalidPath: ?string[] = exceptionPath(['ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

const validationRule = errorRuleBase(validatable, validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle('Interchange identity template'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_interchangeIdentity, validationRule);
