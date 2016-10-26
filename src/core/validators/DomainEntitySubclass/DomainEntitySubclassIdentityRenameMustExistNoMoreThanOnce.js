// @flow
import { domainEntitySubclassErrorRule, includeDomainEntitySubclassRule } from './DomainEntitySubclassValidationRule';
import { valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustExistNoMoreThanOnce';

const domainEntitySubclassFailureMessage = failureMessage('Domain Entity', (ruleContext: any) => ruleContext.entityName().getText());
const validationRule = domainEntitySubclassErrorRule(valid, domainEntitySubclassFailureMessage);
export { validationRule as default };

export const includeRule = includeDomainEntitySubclassRule(validationRule);
