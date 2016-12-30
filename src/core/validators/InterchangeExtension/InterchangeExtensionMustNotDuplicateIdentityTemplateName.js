// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { exceptionPath } from '../ValidationHelper';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';
import type { ValidatableResult } from '../ValidationTypes';

function idsToCheck(ruleContext: any) {
  return ruleContext.interchangeExtensionComponent().interchangeIdentityTemplate().map(x => x.ID().getText());
}

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'InterchangeMustNotDuplicateIdentityTemplateName';
  let invalidPath: ?string[] = exceptionPath(['interchangeExtensionComponent', 'interchangeIdentityTemplate'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const interchangeIdentityTemplate of ruleContext.interchangeExtensionComponent().interchangeIdentityTemplate()) {
    invalidPath = exceptionPath(['ID'], interchangeIdentityTemplate);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = exceptionPath(['extendeeName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Interchange additions',
    'identity template',
    (ruleContext: any): string => ruleContext.extendeeName().getText(),
    idsToCheck);

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_interchangeExtension, validationRule);
