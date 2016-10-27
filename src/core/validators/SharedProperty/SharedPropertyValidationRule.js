// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

export const includeSharedPropertyRule = includeRule(MetaEdGrammar.RULE_sharedProperty);

export const sharedPropertyErrorRule =
    errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_sharedProperty);

export const validForShared = R.curry(
  (entityKey: string, ruleContext: any, symbolTable: SymbolTable): boolean =>
  symbolTable.identifierExists(entityKey, ruleContext.sharedPropertyType().getText())
);

/* eslint-disable no-unused-vars */
export const failureMessageForShared = R.curry(
  (entityTitle: string, ruleContext: any, symbolTable: SymbolTable): string =>
  `Shared property '${ruleContext.propertyName().getText()}' does not match any declared ${entityTitle}.`
);
