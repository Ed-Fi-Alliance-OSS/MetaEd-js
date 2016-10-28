// @flow
import { subdomainErrorRule, includeSubdomainRule } from './SubdomainValidationRule';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';

function idsToCheck(ruleContext: any) {
  return ruleContext.domainItem().map(x => x.ID().getText());
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Subdomain',
    'domain item',
    (ruleContext: any): string => ruleContext.subdomainName().ID().getText(),
    idsToCheck
  );

const validationRule = subdomainErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeSubdomainRule(validationRule);
