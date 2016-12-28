// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validatable, valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustExistNoMoreThanOnce';

const domainEntitySubclassFailureMessage = failureMessage('Domain Entity', (ruleContext: any) => ruleContext.entityName().getText());

const validationRule = errorRuleBase(validatable('DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce'), valid, domainEntitySubclassFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntitySubclass, validationRule);
