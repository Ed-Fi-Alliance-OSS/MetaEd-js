// @flow
import R from 'ramda';
import { errorValidationRuleBase } from '../ValidationRuleBase';
import { includeRule } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import type SymbolTable from '../SymbolTable';
import SymbolTableEntityType from '../SymbolTableEntityType';

export const includeInterchangeRule = includeRule(MetaEdGrammar.RULE_interchange);
export const includeInterchangeElementRule = includeRule(MetaEdGrammar.RULE_interchangeElement);
export const includeInterchangeIdentityTemplateRule = includeRule(MetaEdGrammar.RULE_interchangeIdentityTemplate);

export const interchangeErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_interchange);
export const interchangeElementErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeElement);
export const interchangeIdentityTemplateErrorRule =
  errorValidationRuleBase((ruleContext: any) : boolean => ruleContext.ruleIndex === MetaEdGrammar.RULE_interchangeIdentityTemplate);

export const validForDomainEntityOrAssociationOrSubclass = (ruleContext: any, symbolTable: SymbolTable): boolean => {
  const identifierToMatch = ruleContext.ID().getText();
  return symbolTable.identifierExists(SymbolTableEntityType.abstractEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.association(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.associationSubclass(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntity(), identifierToMatch) ||
    symbolTable.identifierExists(SymbolTableEntityType.domainEntitySubclass(), identifierToMatch);
};

// eslint-disable-next-line no-unused-vars
export const failureMessageForEntityTitle = R.curry((entityTitle: string, ruleContext: any, symbolTable: SymbolTable): string =>
  `${entityTitle} '${ruleContext.ID().getText()}' does not match any declared domain entity or subclass, association or subclass.`);
