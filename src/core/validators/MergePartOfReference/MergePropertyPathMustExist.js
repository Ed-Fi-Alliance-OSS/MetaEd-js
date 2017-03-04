// @flow
import { errorRuleBase } from '../ValidationRuleBase';
import { includeRuleBase } from '../ValidationRuleRepository';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';
import type SymbolTable /* , { EntityContext } */ from '../SymbolTable';
// import { validate, matchAllButFirstAsIdentityProperties } from './PropertyPathLookup';
// import { propertyPathParts } from './MergePartOfReferenceValidationRule';
// import SymbolTableEntityType from '../SymbolTableEntityType';
import type { ValidatableResult } from '../ValidationTypes';

// TODO: *** Empty validatable implementation until port of C# merge property validator rewrite Jan 2017
// eslint-disable-next-line no-unused-vars
export function validatable(ruleContext: any): ValidatableResult {
  return { validatorName: 'MergePropertyPathMustExist' };
}

// different from the one used by other validators
// function lookupParentEntityContext(symbolTable: SymbolTable, ruleContext: any): ?EntityContext {
//   // first parent - mergePartOfReference
//   // second parent - referenceProperty
//   // third parent - property collection
//   // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
//   const parentRuleContext = ruleContext.parentCtx.parentCtx.parentCtx.parentCtx;
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) {
//     return symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.entityName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
//     return symbolTable.get(SymbolTableEntityType.domainEntityExtension(), parentRuleContext.extendeeName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
//     return symbolTable.get(SymbolTableEntityType.domainEntitySubclass(), parentRuleContext.entityName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_association) {
//     return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.associationName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
//     // since the property has to be a PK, it must be defined on the base
//     return symbolTable.get(SymbolTableEntityType.associationExtension(), parentRuleContext.extendeeName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
//     // since the property has to be a PK, it must be defined on the base
//     return symbolTable.get(SymbolTableEntityType.associationSubclass(), parentRuleContext.associationName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) {
//     return symbolTable.get(SymbolTableEntityType.abstractEntity(), parentRuleContext.abstractEntityName().ID().getText());
//   }
//
//   if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_choice) {
//     return symbolTable.get(SymbolTableEntityType.choice(), parentRuleContext.choiceName().ID().getText());
//   }
//
//   throw new Error(`TargetPropertyPathMustExist.lookupParentEntityContext: parentRuleContext was unexpected type ${parentRuleContext.ruleIndex}`);
// }

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  // TODO: disabling this for now, revisit after validator refactor
  return true;
  /*
  const entityContext = lookupParentEntityContext(symbolTable, ruleContext);
  if (entityContext == null) throw new Error('MergePropertyPathMustExist.valid: entityContext not found');
  return validate(symbolTable, entityContext, propertyPathParts(ruleContext), matchAllButFirstAsIdentityProperties);
  */
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Path ${ruleContext.getText()} is not valid.`;
}

const validationRule = errorRuleBase(validatable, valid, failureMessage);
// eslint-disable-next-line import/prefer-default-export
export const includeRule = includeRuleBase(MetaEdGrammar.RULE_mergePropertyPath, validationRule);
