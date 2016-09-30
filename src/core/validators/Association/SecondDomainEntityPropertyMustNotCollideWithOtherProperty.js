// @flow
import R from 'ramda';

import ValidationLevel from '../ValidationLevel';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import validationRuleBase from '../ValidationRuleBase';
import { valid, failureMessage } from './FirstDomainEntityPropertyMustNotCollideWithOtherProperty';

const level = ValidationLevel.Error;

function handled(ruleContext: any) : boolean {
    return ruleContext.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };
