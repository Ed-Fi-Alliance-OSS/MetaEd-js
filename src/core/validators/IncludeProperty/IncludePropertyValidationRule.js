// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeIncludePropertyRule = includeRule(MetaEdGrammar.RULE_includeProperty);

export const includePropertyErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_includeProperty);
