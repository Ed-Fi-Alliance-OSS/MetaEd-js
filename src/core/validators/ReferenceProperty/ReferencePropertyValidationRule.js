// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeReferencePropertyRule = includeRule(MetaEdGrammar.RULE_referenceProperty);

export const referencePropertyErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_referenceProperty);
