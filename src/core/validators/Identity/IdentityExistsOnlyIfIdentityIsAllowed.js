// @flow
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import { topLevelEntityAncestorContext, propertyAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';
import SymbolTableEntityType from '../SymbolTableEntityType';

const validIdentityRuleIndices: number[] = [
  MetaEdGrammar.RULE_abstractEntity,
  MetaEdGrammar.RULE_association,
  MetaEdGrammar.RULE_commonType,
  MetaEdGrammar.RULE_domainEntity,
  MetaEdGrammar.RULE_inlineCommonType,
];

const validIdentityTokenNames: string[] = [
  SymbolTableEntityType.abstractEntity(),
  SymbolTableEntityType.association(),
  SymbolTableEntityType.commonType(),
  SymbolTableEntityType.domainEntity(),
  SymbolTableEntityType.inlineCommonType(),
];

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  return validIdentityRuleIndices.includes(parentEntity.ruleIndex);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'is part of identity' is invalid for property ${parentPropertyName} ` +
    `on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  ` +
    `'is part of identity' is only valid for properties on types: ${validIdentityTokenNames.join(', ')}.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_identity, validationRule);
