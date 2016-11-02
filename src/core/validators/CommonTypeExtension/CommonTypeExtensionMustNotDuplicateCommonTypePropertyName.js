// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import SymbolTableEntityType from '../SymbolTableEntityType';

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifier = ruleContext.extendeeName().getText();
  const commonTypePropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonType(), identifier);
  const extensionPropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonTypeExtension(), identifier);
  return R.intersection(Array.from(commonTypePropertyIdentifiers), Array.from(extensionPropertyIdentifiers)).length === 0;
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.extendeeName().getText();
  const commonTypePropertyIdentifiers =
    Array.from(symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonType(), identifier));
  const propertyRuleContextsForDuplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(SymbolTableEntityType.commonTypeExtension(), identifier, commonTypePropertyIdentifiers);
  const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.propertyName().ID().getText());
  return `Common Type additions '${identifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Common Type.`;
}

const validationRule = errorRuleBase(valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonTypeExtension, validationRule);
