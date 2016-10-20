// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeCommonDecimalRule = includeRule(MetaEdGrammar.RULE_commonDecimal);
export const includeCommonIntegerRule = includeRule(MetaEdGrammar.RULE_commonInteger);
export const includeCommonShortRule = includeRule(MetaEdGrammar.RULE_commonShort);
export const includeCommonStringRule = includeRule(MetaEdGrammar.RULE_commonString);

export const commonDecimalErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_commonDecimal);

export const commonIntegerErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_commonInteger);

export const commonShortErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_commonShort);

export const commonStringErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_commonString);
