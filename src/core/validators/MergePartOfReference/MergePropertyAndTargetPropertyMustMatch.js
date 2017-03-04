// @flow
// import R from 'ramda';
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable /* , { EntityContext } */ from '../SymbolTable';
// import { lookupParentEntityContext, propertyPathParts } from './MergePartOfReferenceValidationRule';
// import { findReferencedProperty, matchAllButFirstAsIdentityProperties, matchAllIdentityProperties } from './PropertyPathLookup';
// import { propertyName } from '../ValidationHelper';
// import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

// TODO: *** Empty validatable implementation until port of C# merge property validator rewrite Jan 2017
// eslint-disable-next-line no-unused-vars
export function validatable(ruleContext: any): ValidatableResult {
  return { validatorName: 'MergePropertyAndTargetPropertyMustMatch' };
}

// const entityContextHasBaseName = R.curry(
//   (baseTypeName: string, entityContext: EntityContext): boolean => entityContext.context.baseName().ID.getText() === baseTypeName);
//
// function matchBaseType(symbolTable: SymbolTable, propertyRuleContext: any, baseTypeName: string): boolean {
//   const hasBaseName = entityContextHasBaseName(baseTypeName);
//   const entityName = propertyName(propertyRuleContext);
//
//   const deSubclassEntityContext = symbolTable.get(SymbolTableEntityType.domainEntitySubclass(), entityName);
//   if (deSubclassEntityContext) return hasBaseName(deSubclassEntityContext);
//
//   const aSubclassEntityContext = symbolTable.get(SymbolTableEntityType.associationSubclass(), entityName);
//   if (aSubclassEntityContext) return hasBaseName(aSubclassEntityContext);
//   return false;
// }
//
// function isReferenceProperty(ruleContext: any): boolean {
//   return ruleContext.ruleIndex === MetaEdGrammar.RULE_associationProperty ||
//     ruleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityProperty ||
//     ruleContext.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity ||
//     ruleContext.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity;
// }

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  // TODO: disabling this for now, revisit after validator refactor

  /*

  // first parent - referenceProperty
  // second parent - property collection
  // third parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
  const entityContext: ?EntityContext = lookupParentEntityContext(symbolTable, ruleContext.parentCtx.parentCtx.parentCtx);
  const fromParts = findReferencedProperty(symbolTable, entityContext);

  const mergeProperty = fromParts(propertyPathParts(ruleContext.mergePropertyPath()), matchAllButFirstAsIdentityProperties);
  const targetProperty = fromParts(propertyPathParts(ruleContext.targetPropertyPath()), matchAllIdentityProperties);
  if (mergeProperty == null || targetProperty == null) return true;

  if (mergeProperty.ruleIndex !== targetProperty.ruleIndex) {
    if (!isReferenceProperty(mergeProperty) || !isReferenceProperty(targetProperty)) return false;
  }

  if (propertyName(mergeProperty) !== propertyName(targetProperty)) {
    if (!isReferenceProperty(mergeProperty) || !isReferenceProperty(targetProperty)) return false;
    if (!matchBaseType(symbolTable, mergeProperty, propertyName(targetProperty)) &&
        !matchBaseType(symbolTable, targetProperty, propertyName(mergeProperty))) return false;
  }

  */
  return true;
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `The merge paths '${ruleContext.mergePropertyPath().getText()}' and '${ruleContext.targetPropertyPath().getText()}' do not correspond to the same entity type.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePartOfReference, validationRule);
