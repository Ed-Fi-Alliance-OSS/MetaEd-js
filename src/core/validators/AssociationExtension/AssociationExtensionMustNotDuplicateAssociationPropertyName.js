// @flow
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import { associationExtensionErrorRule, includeAssociationExtensionRule } from './AssociationExtensionValidationRule';
import type SymbolTable from '../SymbolTable';

function isNotIncludePropertyContextWithExtension(context: any): boolean {
  if (context.ruleIndex !== MetaEdGrammar.RULE_includeProperty) return true;
  return context.includeExtensionOverride() === null;
}

function propertyRuleContextsForDuplicates(context: any, symbolTable: SymbolTable): Array<any> {
  const entityType = context.ASSOCIATION().getText();
  const extensionType = context.ASSOCIATION().getText() + context.ADDITIONS().getText();
  const identifier = context.extendeeName().getText();
  const associationPropertyIdentifiers = symbolTable.identifiersForEntityProperties(entityType, identifier);
  const duplicates = symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, Array.from(associationPropertyIdentifiers));
  return duplicates.filter(x => isNotIncludePropertyContextWithExtension(x));
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  return propertyRuleContextsForDuplicates(ruleContext, symbolTable).length === 0;
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates(ruleContext, symbolTable).map(x => x.propertyName().ID().getText());
  return `Association additions '${ruleContext.extendeeName().getText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
}

const validationRule = associationExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationExtensionRule(validationRule);
