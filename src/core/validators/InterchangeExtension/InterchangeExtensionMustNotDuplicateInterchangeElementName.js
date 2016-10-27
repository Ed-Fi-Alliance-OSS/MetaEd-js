// @flow
import { interchangeExtensionErrorRule, includeInterchangeExtensionRule } from './InterchangeExtensionValidationRule';
import { validForDuplicates, failureMessageForDuplicates } from '../ValidatorShared/InterchangeMustNotDuplicate';

function idsToCheck(ruleContext: any) {
  return ruleContext.interchangeExtensionComponent().interchangeElement().map(x => x.ID().getText());
}

const valid = validForDuplicates(idsToCheck);

const failureMessage =
  failureMessageForDuplicates(
    'Interchange additions',
    'interchange element',
    (ruleContext: any): string => ruleContext.extendeeName().getText(),
    idsToCheck
  );

const validationRule = interchangeExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeInterchangeExtensionRule(validationRule);
