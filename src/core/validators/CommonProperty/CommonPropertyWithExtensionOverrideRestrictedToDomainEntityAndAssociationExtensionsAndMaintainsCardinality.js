// @flow
import type SymbolTable, { EntityContext } from '../SymbolTable';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import { topLevelEntityAncestorContext, propertyAncestorContext, exceptionPath, entityNameExceptionPath, entityIdentifierExceptionPath, entityIdentifier, entityName } from '../ValidationHelper';
import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

function cardinalitiesMatch(commonPropertyContext: any, otherCommonPropertyContext: any): boolean {
  const propertyAnnotationContext = commonPropertyContext.propertyComponents().propertyAnnotation();
  if (!propertyAnnotationContext || propertyAnnotationContext.exception) return false;
  const otherPropertyAnnotationContext = otherCommonPropertyContext.propertyComponents().propertyAnnotation();
  if (!otherPropertyAnnotationContext || otherPropertyAnnotationContext.exception) return false;
  if (propertyAnnotationContext.required() && !propertyAnnotationContext.required().exception &&
    otherPropertyAnnotationContext.required() && !otherPropertyAnnotationContext.required()) return true;
  if (propertyAnnotationContext.optional() && !propertyAnnotationContext.optional() &&
    otherPropertyAnnotationContext.optional() && !otherPropertyAnnotationContext.optional().exception) return true;
  if (propertyAnnotationContext.collection() && !propertyAnnotationContext.collection().exception &&
    propertyAnnotationContext.collection().requiredCollection() && !propertyAnnotationContext.collection().requiredCollection().exception &&
    otherPropertyAnnotationContext.collection() && !otherPropertyAnnotationContext.collection().exception &&
    otherPropertyAnnotationContext.collection().requiredCollection() && !otherPropertyAnnotationContext.collection().requiredCollection().exception) return true;
  if (propertyAnnotationContext.collection() && !propertyAnnotationContext.collection().exception &&
    propertyAnnotationContext.collection().optionalCollection() && !propertyAnnotationContext.collection().optionalCollection().exception &&
    otherPropertyAnnotationContext.collection() && !otherPropertyAnnotationContext.collection().exception &&
    otherPropertyAnnotationContext.collection().optionalCollection() && !otherPropertyAnnotationContext.collection().optionalCollection().exception) return true;
  return false;
}

function maintainsCardinality(overriddenCommonPropertyContext: any, extendeeEntityContext: EntityContext): boolean {
  const originalCommonPropertyContext = extendeeEntityContext.propertySymbolTable.get(overriddenCommonPropertyContext.propertyName().ID().getText());
  if (originalCommonPropertyContext == null) return false;
  if (originalCommonPropertyContext.ruleIndex !== MetaEdGrammar.RULE_commonProperty) return false;
  return cardinalitiesMatch(originalCommonPropertyContext, overriddenCommonPropertyContext);
}

function maintainsCardinalityOnDomainEntity(symbolTable: SymbolTable, overriddenCommonPropertyContext: any, domainEntityExtensionContext: any): boolean {
  const extendeeEntityContext = symbolTable.get(SymbolTableEntityType.domainEntity(), domainEntityExtensionContext.extendeeName().ID().getText());
  if (extendeeEntityContext == null) throw new Error('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality: extendeeEntityContext was null');
  return maintainsCardinality(overriddenCommonPropertyContext, extendeeEntityContext);
}

function maintainsCardinalityOnAssociation(symbolTable: SymbolTable, overriddenCommonPropertyContext: any, associationExtensionContext: any): boolean {
  const extendeeEntityContext = symbolTable.get(SymbolTableEntityType.association(), associationExtensionContext.extendeeName().ID().getText());
  if (extendeeEntityContext == null) throw new Error('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality: extendeeEntityContext was null');
  return maintainsCardinality(overriddenCommonPropertyContext, extendeeEntityContext);
}

export function validatable(ruleContext: any): ValidatableResult {
  const validatorName = 'CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality';

  if (ruleContext.commonExtensionOverride() == null) return { validatorName };

  let invalidPath: ?string[] = exceptionPath(['propertyName', 'ID'], ruleContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = exceptionPath(['propertyName', 'ID'], propertyAncestorContext(ruleContext));
  if (invalidPath) return { invalidPath, validatorName };

  const parentEntityContext = topLevelEntityAncestorContext(ruleContext);

  if (parentEntityContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension ||
    parentEntityContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    invalidPath = exceptionPath(['extendeeName', 'ID'], parentEntityContext);
    if (invalidPath) return { invalidPath, validatorName };
  }

  invalidPath = entityNameExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  invalidPath = entityIdentifierExceptionPath(parentEntityContext);
  if (invalidPath) return { invalidPath, validatorName };

  return { validatorName };
}

function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  if (ruleContext.commonExtensionOverride() == null) return true;
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
  return `'common extension' is invalid for property ${parentPropertyName} on ${entityIdentifier(parentEntity)} '${entityName(parentEntity)}'.  'common extension' is only valid for referencing Common extensions.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_commonProperty, validationRule);
