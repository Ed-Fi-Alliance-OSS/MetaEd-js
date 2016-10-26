// @flow
import { associationSubclassErrorRule, includeAssociationSubclassRule } from './AssociationSubclassValidationRule';
import { valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustExistNoMoreThanOnce';

const associationSubclassFailureMessage = failureMessage('Association', (ruleContext: any) => ruleContext.associationName().getText());
const validationRule = associationSubclassErrorRule(valid, associationSubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeAssociationSubclassRule(validationRule);
