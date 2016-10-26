// @flow
import R from 'ramda';
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import type SymbolTable from './SymbolTable';

function isNotIncludePropertyContextWithExtension(context: any): boolean {
  if (context.ruleIndex !== MetaEdGrammar.RULE_includeProperty) return true;
  return context.includeExtensionOverride() === null;
}

function propertyRuleContextsForDuplicates(entityKey: string, extensionKey: string, context: any, symbolTable: SymbolTable): Array<any> {
  const identifier = context.extendeeName().getText();
  const associationPropertyIdentifiers = symbolTable.identifiersForEntityProperties(entityKey, identifier);
  const duplicates =
    symbolTable.contextsForMatchingPropertyIdentifiers(extensionKey, identifier, Array.from(associationPropertyIdentifiers));
  return duplicates.filter(x => isNotIncludePropertyContextWithExtension(x));
}

function validUncurried(entityKey: string, extensionKey: string, ruleContext: any, symbolTable: SymbolTable): boolean {
  return propertyRuleContextsForDuplicates(entityKey, extensionKey, ruleContext, symbolTable).length === 0;
}

export const valid = R.curry(validUncurried);

function failureMessageUncurried(entityTitle: string, entityKey: string, extensionKey: string, ruleContext: any, symbolTable: SymbolTable): string {
  const duplicatePropertyIdentifierList =
    propertyRuleContextsForDuplicates(entityKey, extensionKey, ruleContext, symbolTable).map(x => x.propertyName().ID().getText());
  return `${entityTitle} additions '${ruleContext.extendeeName().getText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of {entityTitle}.`;
}

export const failureMessage = R.curry(failureMessageUncurried);
