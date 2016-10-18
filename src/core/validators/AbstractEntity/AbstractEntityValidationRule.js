// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

const RULE_abstractEntity: number = MetaEdGrammar.RULE_abstractEntity;

export const includeAbstractEntityRule = includeRule(RULE_abstractEntity);

export const abstractEntityErrorRule =
    errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === RULE_abstractEntity);
