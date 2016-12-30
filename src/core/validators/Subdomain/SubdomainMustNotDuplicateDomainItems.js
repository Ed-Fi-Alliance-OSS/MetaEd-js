// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';
import { exceptionPath } from '../ValidationHelper';
import type { ValidatableResult } from '../ValidationTypes';

function idsToCheck(ruleContext: any) {
  return ruleContext.domainItem().map(x => x.ID().getText());
}

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'SubdomainMustNotDuplicateDomainItems';
  let invalidPath: ?string[] = exceptionPath(['subdomainName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  // eslint-disable-next-line no-restricted-syntax
  for (const domainItem of ruleContext.domainItem()) {
    invalidPath = exceptionPath(['ID'], domainItem);
    if (invalidPath) return { invalidPath, validatorName };
  }

  return { validatorName };
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Subdomain',
    'domain item',
    (ruleContext: any): string => ruleContext.subdomainName().ID().getText(),
    idsToCheck,
  );

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_subdomain, validationRule);
