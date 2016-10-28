// @flow
import { interchangeExtensionErrorRule, includeInterchangeExtensionRule } from './InterchangeExtensionValidationRule';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/MustNotDuplicate';

function idsToCheck(ruleContext: any) {
  return ruleContext.interchangeExtensionComponent().interchangeIdentityTemplate().map(x => x.ID().getText());
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Interchange additions',
    'identity template',
    (ruleContext: any): string => ruleContext.extendeeName().getText(),
    idsToCheck
  );

const validationRule = interchangeExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInterchangeExtensionRule(validationRule);
