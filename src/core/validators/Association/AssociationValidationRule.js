// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const RULE_association : number = MetaEdGrammar.RULE_association;
export const RULE_firstDomainEntity : number = MetaEdGrammar.RULE_firstDomainEntity;
export const RULE_secondDomainEntity : number = MetaEdGrammar.RULE_secondDomainEntity;

export const includeAssociationRule = includeRule(RULE_association);
export const includeFirstDomainEntityRule = includeRule(RULE_firstDomainEntity);
export const includeSecondDomainEntityRule = includeRule(RULE_secondDomainEntity);

export const associationErrorRule = 
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === RULE_association);

export const firstDomainEntityErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === RULE_firstDomainEntity);

export const secondDomainEntityErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === RULE_secondDomainEntity);
