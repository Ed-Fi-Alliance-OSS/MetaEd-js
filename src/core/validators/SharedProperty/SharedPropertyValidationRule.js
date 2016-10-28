// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeSharedDecimalPropertyRule = includeRule(MetaEdGrammar.RULE_sharedDecimalProperty);
export const includeSharedIntegerPropertyRule = includeRule(MetaEdGrammar.RULE_sharedIntegerProperty);
export const includeSharedShortPropertyRule = includeRule(MetaEdGrammar.RULE_sharedShortProperty);
export const includeSharedStringPropertyRule = includeRule(MetaEdGrammar.RULE_sharedStringProperty);

export const sharedDecimalPropertyErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedDecimalProperty);
export const sharedIntegerPropertyErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedIntegerProperty);
export const sharedShortPropertyErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedShortProperty);
export const sharedStringPropertyErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedStringProperty);

export const validForShared = R.curry(
  (entityKey: string, ruleContext: any, symbolTable: SymbolTable): boolean =>
  symbolTable.identifierExists(entityKey, ruleContext.sharedPropertyType().getText())
);

/* eslint-disable no-unused-vars */
export const failureMessageForShared = R.curry(
  (entityTitle: string, ruleContext: any, symbolTable: SymbolTable): string =>
  `Shared property '${ruleContext.propertyName().getText()}' does not match any declared ${entityTitle}.`
);
