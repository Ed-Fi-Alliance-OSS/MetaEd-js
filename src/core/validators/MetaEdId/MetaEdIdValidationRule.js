// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeMetaEdIdRule = includeRule(MetaEdGrammar.RULE_metaEdId);

export const metaEdIdErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_metaEdId);
