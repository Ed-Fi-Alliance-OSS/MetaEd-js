// @flow
import { domainErrorRule, includeDomainRule } from './DomainValidationRule';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';

function idsToCheck(ruleContext: any) {
  return ruleContext.domainItem().map(x => x.ID().getText());
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Domain',
    'domain item',
    (ruleContext: any): string => ruleContext.domainName().ID().getText(),
    idsToCheck
  );

const validationRule = domainErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeDomainRule(validationRule);
