// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { exceptionPath } from '../ValidationHelper';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';
import type { ValidatableResult } from '../ValidationTypes';

function idsToCheck(ruleContext: any) {
  return ruleContext.interchangeComponent().interchangeElement().map(x => x.ID().getText());
}

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'InterchangeMustNotDuplicateInterchangeElementName';
  let invalidPath: ?string[] = exceptionPath(['interchangeComponent', 'interchangeElement'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const interchangeElement of ruleContext.interchangeComponent().interchangeElement()) {
    invalidPath = exceptionPath(['ID'], interchangeElement);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = exceptionPath(['interchangeName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Interchange',
    'interchange element',
    (ruleContext: any): string => ruleContext.interchangeName().getText(),
    idsToCheck);

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_interchange, validationRule);
