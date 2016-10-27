// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeInterchangeExtensionRule = includeRule(MetaEdGrammar.RULE_interchangeExtension);

export const interchangeExtensionErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeExtension);
