// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeAbstractEntityRule = includeRule(MetaEdGrammar.RULE_abstractEntity);

export const abstractEntityErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity);
