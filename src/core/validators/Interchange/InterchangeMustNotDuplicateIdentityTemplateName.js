// @flow
import { interchangeErrorRule, includeInterchangeRule } from './InterchangeValidationRule';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/InterchangeMustNotDuplicate';

function idsToCheck(ruleContext: any) {
  return ruleContext.interchangeComponent().interchangeIdentityTemplate().map(x => x.ID().getText());
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Interchange',
    'identity template',
    (ruleContext: any): string => ruleContext.interchangeName().getText(),
    idsToCheck
  );

const validationRule = interchangeErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInterchangeRule(validationRule);
