// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeDecimalPropertyRule = includeRule(MetaEdGrammar.RULE_decimalProperty);

export const decimalPropertyErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_decimalProperty);
