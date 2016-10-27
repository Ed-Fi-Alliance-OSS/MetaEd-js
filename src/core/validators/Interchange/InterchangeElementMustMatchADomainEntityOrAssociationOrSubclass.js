// @flow
import { includeInterchangeElementRule, interchangeElementErrorRule,
  validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle } from './InterchangeValidationRule';

const validationRule = interchangeElementErrorRule(validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle('Interchange element'));
export { validationRule as default };

export const includeRule = includeInterchangeElementRule(validationRule);
