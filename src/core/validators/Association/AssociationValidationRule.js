// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeAssociationRule = includeRule(MetaEdGrammar.RULE_association);
export const includeFirstDomainEntityRule = includeRule(MetaEdGrammar.RULE_firstDomainEntity);
export const includeSecondDomainEntityRule = includeRule(MetaEdGrammar.RULE_secondDomainEntity);

export const associationErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_association);

export const firstDomainEntityErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity);

export const secondDomainEntityErrorRule =
  errorValidationRuleBase((ruleContext: any): boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity);
