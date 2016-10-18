// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const RULE_associationExtension : number = MetaEdGrammar.RULE_associationExtension;

export const includeAssociationExtensionRule = includeRule(RULE_associationExtension);

export const associationExtensionErrorRule = 
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === RULE_associationExtension);
