// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { validatable, valid, failureMessage } from './FirstDomainEntityPropertyMustNotCollideWithOtherProperty';

const validationRule = errorRuleBase(validatable('SecondDomainEntityPropertyMustNotCollideWithOtherProperty'), valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_secondDomainEntity, validationRule);
