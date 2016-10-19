// @flow
import { secondDomainEntityErrorRule, includeSecondDomainEntityRule } from './AssociationValidationRule';
import { valid, failureMessage } from './FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity';

const validationRule = secondDomainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeSecondDomainEntityRule(validationRule);
