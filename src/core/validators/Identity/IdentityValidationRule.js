// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeIdentityRule = includeRule(MetaEdGrammar.RULE_identity);

export const identityErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_identity);
