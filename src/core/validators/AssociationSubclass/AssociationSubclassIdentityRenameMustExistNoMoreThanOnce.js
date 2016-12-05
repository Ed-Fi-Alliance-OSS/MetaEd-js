// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { valid, failureMessage } from '../ValidatorShared/SubclassIdentityRenameMustExistNoMoreThanOnce';

const associationSubclassFailureMessage = failureMessage('Association', (ruleContext: any) => ruleContext.associationName().getText());

const validationRule = errorRuleBase(valid, associationSubclassFailureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_associationSubclass, validationRule);
