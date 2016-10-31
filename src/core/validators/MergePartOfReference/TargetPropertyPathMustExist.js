// @flow
import { targetPropertyPathErrorRule, includeTargetPropertyPathRule } from './MergePartOfReferenceValidationRule';
import type SymbolTable, { EntityContext } from '../SymbolTable';
import { validate, matchAllIdentityProperties } from './PropertyPathLookup';
import SymbolTableEntityType from '../SymbolTableEntityType';
import { MetaEdGrammar } from '../../../grammar/gen/MetaEdGrammar';

function lookupParentEntityContext(symbolTable: SymbolTable, ruleContext: any): ?EntityContext {
  // first parent - mergePartOfReference
  // second parent - referenceProperty
  // third parent - property collection
  // fourth parent - Association/Extension/Subclass or DomainEntity/Extension/Subclass
  const parentRuleContext = ruleContext.parentCtx.parentCtx.parentCtx.parentCtx;

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntity) {
    return symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.entityName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntityExtension) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.extendeeName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_domainEntitySubclass) {
    // since the property has to be a PK, it must be defined on the base
    const domainEntity = symbolTable.get(SymbolTableEntityType.domainEntity(), parentRuleContext.baseName().ID().getText());
    if (domainEntity != null) return domainEntity;
    return symbolTable.get(SymbolTableEntityType.abstractEntity(), parentRuleContext.baseName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_association) {
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.associationName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.extendeeName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_associationSubclass) {
    // since the property has to be a PK, it must be defined on the base
    return symbolTable.get(SymbolTableEntityType.association(), parentRuleContext.baseName().ID().getText());
  }

  if (parentRuleContext.ruleIndex === MetaEdGrammar.RULE_abstractEntity) {
    return symbolTable.get(SymbolTableEntityType.abstractEntity(), parentRuleContext.abstractEntityName().ID().getText());
  }

  throw new Error('TargetPropertyPathMustExist.lookupParentEntityContext: parentRuleContext was unexpected type');
}

// eslint-disable-next-line no-unused-vars
export function valid(ruleContext: any, symbolTable: SymbolTable): boolean {
  const entityContext = lookupParentEntityContext(symbolTable, ruleContext);
  if (entityContext == null) throw new Error('TargetPropertyPathMustExist.valid: entityContext not found');
  const propertyPathParts = ruleContext.propertyPath().PropertyPathParts();
  return validate(symbolTable, entityContext, propertyPathParts, matchAllIdentityProperties);
}

// eslint-disable-next-line no-unused-vars
function failureMessage(ruleContext: any, symbolTable: SymbolTable): string {
  return `Path ${ruleContext.getText()} is not valid or lists properties that are not part of the primary key.`;
}

const validationRule = targetPropertyPathErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeTargetPropertyPathRule(validationRule);
