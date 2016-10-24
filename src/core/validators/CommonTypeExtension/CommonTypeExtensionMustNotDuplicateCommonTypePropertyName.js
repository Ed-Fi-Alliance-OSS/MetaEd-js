// @flow
import R from 'ramda';
import type SymbolTable from '../SymbolTable';
import { commonTypeExtensionErrorRule, includeCommonTypeExtensionRule } from './CommonTypeExtensionValidationRule';
import SymbolTableEntityType from '../SymbolTableEntityType';

// eslint-disable-next-line no-unused-vars
function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const identifier = ruleContext.extendeeName().getText();
  const commonTypePropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonType(), identifier);
  const extensionPropertyIdentifiers = symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonTypeExtension(), identifier);
  return R.intersection(Array.from(commonTypePropertyIdentifiers), Array.from(extensionPropertyIdentifiers)).length === 0;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const identifier = ruleContext.extendeeName().getText();
  const commonTypePropertyIdentifiers =
    Array.from(symbolTable.identifiersForEntityProperties(SymbolTableEntityType.commonType(), identifier));
  const propertyRuleContextsForDuplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(SymbolTableEntityType.commonTypeExtension(), identifier, commonTypePropertyIdentifiers);
  const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.propertyName().ID().getText());
  return `Common Type additions '${identifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Common Type.`;
}

const validationRule = commonTypeExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeCommonTypeExtensionRule(validationRule);
