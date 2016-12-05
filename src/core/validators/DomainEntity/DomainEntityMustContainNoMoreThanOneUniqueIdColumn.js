// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { namespaceAncestorContext, getProperty } from '../ValidationHelper';

function isExtension(namespaceContext: any): boolean {
  return namespaceContext.namespaceType().namespaceProjectExtension() != null;
}

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const namespaceContext = namespaceAncestorContext(ruleContext);
  return isExtension(namespaceContext) || R.map(x => getProperty(x).propertyName() === 'UniqueId', ruleContext.property()).length <= 1;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Domain Entity ${ruleContext.entityName().ID().getText()} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_domainEntity, validationRule);
