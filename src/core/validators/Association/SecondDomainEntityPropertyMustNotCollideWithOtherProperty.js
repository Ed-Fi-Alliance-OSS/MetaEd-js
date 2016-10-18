// @flow
import { secondDomainEntityErrorRule, includeSecondDomainEntityRule } from './AssociationValidationRule';
import { valid, failureMessage } from './FirstDomainEntityPropertyMustNotCollideWithOtherProperty';

const validationRule = secondDomainEntityErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeSecondDomainEntityRule(validationRule);