// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeMergePartOfReferenceRule = includeRule(MetaEdGrammar.RULE_mergePartOfReference);
export const includeMergePropertyPathRule = includeRule(MetaEdGrammar.RULE_mergePropertyPath);
export const includeTargetPropertyPathRule = includeRule(MetaEdGrammar.RULE_targetPropertyPath);

export const mergePartOfReferenceErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_mergePartOfReference);
export const mergePropertyPathErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_mergePropertyPath);
export const targetPropertyPathErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_targetPropertyPath);
