// @flow
import { includeInterchangeIdentityTemplateRule, interchangeIdentityTemplateErrorRule,
  validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle } from './InterchangeValidationRule';

const validationRule =
  interchangeIdentityTemplateErrorRule(validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle('Interchange identity template'));
export { validationRule as default };

export const includeRule = includeInterchangeIdentityTemplateRule(validationRule);
