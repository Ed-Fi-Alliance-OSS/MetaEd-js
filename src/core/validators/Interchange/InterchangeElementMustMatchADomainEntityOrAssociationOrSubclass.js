// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle } from './InterchangeValidationRule';
import type { ValidatableResult } from '../ValidationTypes';
import { exceptionPath } from '../ValidationHelper';

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass';
  const invalidPath: ?string[] = exceptionPath(['ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

const validationRule = errorRuleBase(validatable, validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle('Interchange element'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_interchangeElement, validationRule);
