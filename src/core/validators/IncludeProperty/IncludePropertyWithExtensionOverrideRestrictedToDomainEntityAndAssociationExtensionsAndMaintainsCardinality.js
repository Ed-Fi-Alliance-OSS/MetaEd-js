// @flow
import type SymbolTable, { EntityContext } from '../SymbolTable';
import { includePropertyErrorRule, includeIncludePropertyRule } from './IncludePropertyValidationRule';
import { topLevelEntityAncestorContext, propertyAncestorContext } from '../ValidationHelper';
import { entityIdentifier, entityName } from '../TopLevelEntityInformation';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';

function cardinalitiesMatch(includePropertyContext: any, otherIncludePropertyContext: any): boolean {
  const propertyAnnotationContext = includePropertyContext.propertyComponents().propertyAnnotation();
  const otherPropertyAnnotationContext = otherIncludePropertyContext.propertyComponents().propertyAnnotation();
  if (propertyAnnotationContext.required() && otherPropertyAnnotationContext.required()) return true;
  if (propertyAnnotationContext.optional() && otherPropertyAnnotationContext.optional()) return true;
  if (propertyAnnotationContext.collection() && propertyAnnotationContext.collection().requiredCollection() &&
    otherPropertyAnnotationContext.collection() && otherPropertyAnnotationContext.collection().requiredCollection()) return true;
  if (propertyAnnotationContext.collection() && propertyAnnotationContext.collection().optionalCollection() &&
    otherPropertyAnnotationContext.collection() && otherPropertyAnnotationContext.collection().optionalCollection()) return true;
  return false;
}

function maintainsCardinality(overriddenIncludePropertyContext: any, extendeeEntityContext: EntityContext): boolean {
  const originalIncludePropertyContext = extendeeEntityContext.propertySymbolTable.get(overriddenIncludePropertyContext.propertyName().ID().getText());
  if (originalIncludePropertyContext == null) return false;
  if (originalIncludePropertyContext.ruleIndex !== MetaEdGrammar.RULE_includeProperty) return false;
  return cardinalitiesMatch(originalIncludePropertyContext, overriddenIncludePropertyContext);
}

function maintainsCardinalityOnDomainEntity(symbolTable: SymbolTable, overriddenIncludePropertyContext: any, domainEntityExtensionContext: any): boolean {
  const extendeeEntityContext = symbolTable.get(SymbolTableEntityType.domainEntity(), domainEntityExtensionContext.extendeeName().ID().getText());
  if (extendeeEntityContext == null) throw new Error('IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality: extendeeEntityContext was null');
  return maintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
}

function maintainsCardinalityOnAssociation(symbolTable: SymbolTable, overriddenIncludePropertyContext: any, associationExtensionContext: any): boolean {
  const extendeeEntityContext = symbolTable.get(SymbolTableEntityType.association(), associationExtensionContext.extendeeName().ID().getText());
  if (extendeeEntityContext == null) throw new Error('IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality: extendeeEntityContext was null');
  return maintainsCardinality(overriddenIncludePropertyContext, extendeeEntityContext);
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.includeExtensionOverride() == null) return true;
  const parentEntityContext = topLevelEntityAncestorContext(ruleContext);
  if (parentEntityContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
    return maintainsCardinalityOnDomainEntity(symbolTable, ruleContext, parentEntityContext);
  }
  if (parentEntityContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    return maintainsCardinalityOnAssociation(symbolTable, ruleContext, parentEntityContext);
  }
  return false;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  const parentEntity = topLevelEntityAncestorContext(ruleContext);
  const parentPropertyName = propertyAncestorContext(ruleContext).propertyName().ID().getText();
  return `'include extension' is invalid for property ${parentPropertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  'include extension' is only valid for referencing common type extensions.`;
}

const validationRule = includePropertyErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeIncludePropertyRule(validationRule);
