// @flow
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeIdentityRenameRule = includeRule(MetaEdGrammar.RULE_identityRename);

export const identityRenameErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_identityRename);
