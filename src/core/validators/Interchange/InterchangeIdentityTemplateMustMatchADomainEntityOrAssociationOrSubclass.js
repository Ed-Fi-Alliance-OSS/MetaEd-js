// @flow
import { validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle } from './InterchangeValidationRule';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

const validationRule = errorRuleBase(validForDomainEntityOrAssociationOrSubclass, failureMessageForEntityTitle('Interchange identity template'));
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_interchangeIdentityTemplate, validationRule);
